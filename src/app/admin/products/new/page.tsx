"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Upload, X, ArrowLeft, Save, Plus, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "react-hot-toast";
import { productAPI, categoryAPI } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

// Define form validation schema
const productFormSchema = z.object({
  name: z.string().min(2, {
    message: "商品名称至少需要2个字符",
  }),
  description: z.string().min(10, {
    message: "商品描述至少需要10个字符",
  }),
  price: z.coerce.number().positive({
    message: "价格必须大于0",
  }),
  originalPrice: z.coerce.number().positive({
    message: "原价必须大于0",
  }).optional(),
  stock: z.coerce.number().int().nonnegative({
    message: "库存必须为非负整数",
  }),
  category: z.string({
    required_error: "请选择商品分类",
  }),
  status: z.enum(["active", "out_of_stock", "discontinued"], {
    required_error: "请选择商品状态",
  }),
  sku: z.string().optional(),
  weight: z.coerce.number().positive({
    message: "重量必须大于0",
  }).optional(),
  dimensions: z.string().optional(),
  features: z.string().optional(),
  materials: z.string().optional(),
  tags: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

// Default values for the form
const defaultValues: Partial<ProductFormValues> = {
  name: "",
  description: "",
  price: 0,
  originalPrice: 0,
  stock: 0,
  category: "",
  status: "active",
  sku: "",
  weight: 0,
  dimensions: "",
  features: "",
  materials: "",
  tags: "",
  metaTitle: "",
  metaDescription: "",
};

export default function NewProductPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("basic");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<{value: string, label: string}[]>([]);
  const [featured, setFeatured] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isHot, setIsHot] = useState(false);
  const [isPromotion, setIsPromotion] = useState(false);

  // 检查认证状态
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log("检查认证状态:", { isAuthenticated, userRole: user?.role });
        
        // 检查本地存储中的token
        const token = localStorage.getItem('token');
        console.log("本地存储中的认证token:", { exists: !!token });
        
        if (!token) {
          toast.error("未找到认证令牌，请重新登录");
          router.push('/admin/login');
          return;
        }
        
        if (!isAuthenticated) {
          toast.error("您需要登录才能访问此页面");
          router.push('/admin/login');
          return;
        }

        if (user?.role !== 'ADMIN') {
          toast.error("您没有管理员权限");
          router.push('/admin/login');
          return;
        }
      } catch (err) {
        console.error("认证检查错误:", err);
        toast.error("认证系统错误，请重新登录");
        router.push('/admin/login');
      }
    };
    
    checkAuthStatus();
  }, [isAuthenticated, user, router]);

  // 获取分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      if (!isAuthenticated) return; // 如果未认证，不要尝试获取数据
      
      setIsLoading(true);
      try {
        // 确认有token
        const token = localStorage.getItem('token');
        if (!token) {
          setError("未找到认证令牌，请重新登录");
          toast.error("认证失败，请重新登录");
          router.push('/admin/login');
          return;
        }
        
        const response = await categoryAPI.getAllCategories();
        if (response.success) {
          // 转换分类数据格式
          const formattedCategories = response.data.map((category: any) => ({
            value: category.id,
            label: category.name
          }));
          setCategories(formattedCategories);
        } else {
          setError("获取分类数据失败");
          toast.error("获取分类数据失败");
        }
      } catch (err: any) {
        console.error("获取分类数据错误:", err);
        
        // 处理401错误
        if (err.response && err.response.status === 401) {
          setError("认证失败，请重新登录");
          toast.error("认证失败，请重新登录");
          setTimeout(() => router.push('/admin/login'), 1500);
          return;
        }
        
        setError("获取分类数据时发生错误");
        toast.error("获取分类数据失败，请刷新重试");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [isAuthenticated, router]);

  // Initialize form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  // Handler for form submission
  const onSubmit = async (values: ProductFormValues) => {
    // 再次验证认证状态
    const token = localStorage.getItem('token');
    console.log("提交表单时认证状态:", {
      tokenExists: !!token,
      tokenLength: token ? token.length : 0,
      isAuthenticated,
      userRole: user?.role
    });
    
    if (!token || !isAuthenticated || user?.role !== 'ADMIN') {
      toast.error("认证失败，请重新登录");
      // 清除认证数据
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/admin/login');
      return;
    }

    if (images.length === 0) {
      toast.error("请至少上传一张商品图片");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // 确认令牌依然有效
      try {
        // 发送一个简单请求验证令牌是否有效
        const testResponse = await categoryAPI.getAllCategories();
        console.log("令牌验证成功，可以继续操作");
      } catch (verifyErr: any) {
        if (verifyErr.response && verifyErr.response.status === 401) {
          console.error("令牌验证失败:", verifyErr);
          toast.error("认证已过期，请重新登录");
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/admin/login');
          return;
        }
        // 其他错误继续提交流程
      }

      // 准备商品数据
      const productData = {
        name: values.name,
        description: values.description,
        price: values.price,
        comparePrice: values.originalPrice || undefined,
        stock: values.stock,
        images: images,
        categoryId: values.category,
        featured: featured,
      };

      console.log("提交商品数据:", productData);

      // 调用API创建商品
      const response = await productAPI.createProduct(productData);
      
      if (response.success) {
        toast.success("商品添加成功");
        // 成功后导航回商品列表
        router.push("/admin/products");
      } else {
        console.error("API返回错误:", response);
        setError(response.message || "添加商品失败");
        toast.error(response.message || "添加商品失败");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      console.error("提交商品数据错误:", err);
      
      // 显示更详细的错误信息
      let errorMessage = "添加商品失败，请稍后再试";
      
      if (err.response) {
        // 服务器返回的错误
        console.error("错误状态:", err.response.status);
        console.error("错误数据:", err.response.data);
        
        // 处理401未授权错误
        if (err.response.status === 401) {
          errorMessage = "认证失败，请重新登录";
          // 清除登录信息
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setTimeout(() => {
            router.push('/admin/login');
          }, 1500);
        } else if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        // 请求发送但没有收到响应
        errorMessage = "服务器无响应，请检查网络连接";
      } else {
        // 请求设置时发生的错误
        errorMessage = err.message || "请求错误";
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  // 图片上传处理函数
  const handleImageUpload = () => {
    // 在实际应用中，这里应该调用图片上传API
    // 目前使用示例图片作为演示
    const demoImages = [
      "https://ext.same-assets.com/3058330213/2058260766.jpeg", // 女性产品图片
      "https://ext.same-assets.com/3058330213/3156523865.jpeg", // 男性产品图片
    ];
    
    // 随机选择一张图片
    const newImage = demoImages[Math.floor(Math.random() * demoImages.length)];
    setImages([...images, newImage]);
    toast.success("图片上传成功");
  };

  // Handler to remove an image
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => router.push("/admin/products")}
        >
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-2xl font-bold">添加新商品</h1>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertCircle size={18} className="mr-2" />
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Left Column */}
            <div className="col-span-1 lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>商品基本信息</CardTitle>
                  <CardDescription>填写商品的基本信息</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>商品名称 *</FormLabel>
                        <FormControl>
                          <Input placeholder="输入商品名称" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>商品描述 *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="详细描述商品的特点、用途等信息"
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>销售价格 *</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="originalPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>原价</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>库存 *</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU</FormLabel>
                          <FormControl>
                            <Input placeholder="商品编码" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>状态 *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="选择商品状态" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">在售</SelectItem>
                              <SelectItem value="out_of_stock">缺货</SelectItem>
                              <SelectItem value="discontinued">已下架</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>商品图片</CardTitle>
                  <CardDescription>上传商品的展示图片（建议上传多张不同角度的图片）</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                        <Image
                          src={image}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                          onClick={() => removeImage(index)}
                        >
                          <X size={16} className="text-gray-700" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={handleImageUpload}
                      className="border-2 border-dashed border-gray-300 aspect-square rounded-md flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50"
                    >
                      <Upload size={24} className="mb-2" />
                      <span className="text-sm font-medium">上传图片</span>
                    </button>
                  </div>

                  {images.length === 0 && (
                    <p className="text-sm text-amber-600 mt-4 flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      请至少上传一张商品图片
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>详细信息</CardTitle>
                  <CardDescription>填写商品的详细规格和特性</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="specifications" onValueChange={(value) => setActiveTab(value)}>
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger value="specifications">规格参数</TabsTrigger>
                      <TabsTrigger value="features">产品特点</TabsTrigger>
                      <TabsTrigger value="seo">SEO信息</TabsTrigger>
                    </TabsList>

                    <TabsContent value="specifications" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>商品分类 *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="选择商品分类" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {isLoading ? (
                                    <SelectItem value="loading" disabled>加载中...</SelectItem>
                                  ) : (
                                    categories.map((category) => (
                                      <SelectItem key={category.value} value={category.value}>
                                        {category.label}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>重量 (g)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="dimensions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>尺寸</FormLabel>
                            <FormControl>
                              <Input placeholder="长 x 宽 x 高 (cm)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="materials"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>材质</FormLabel>
                            <FormControl>
                              <Input placeholder="产品材质，例如：医用级硅胶、ABS塑料等" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="features" className="space-y-4">
                      <FormField
                        control={form.control}
                        name="features"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>产品特点</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="每行输入一个产品特点，如：防水设计、静音马达等"
                                className="min-h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              每行一个特点，这些会显示为产品页面的要点列表
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>标签</FormLabel>
                            <FormControl>
                              <Input placeholder="用逗号分隔不同标签，如：防水,静音,遥控" {...field} />
                            </FormControl>
                            <FormDescription>
                              标签用于帮助客户搜索和筛选商品
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="seo" className="space-y-4">
                      <FormField
                        control={form.control}
                        name="metaTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SEO 标题</FormLabel>
                            <FormControl>
                              <Input placeholder="SEO 标题，建议不超过70个字符" {...field} />
                            </FormControl>
                            <FormDescription>
                              如果留空，将使用商品名称作为SEO标题
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="metaDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SEO 描述</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="SEO 描述，建议不超过160个字符"
                                className="min-h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              如果留空，将使用商品描述的前160个字符作为SEO描述
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Right Column */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>发布</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting ? "提交中..." : "发布商品"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/admin/products")}
                  >
                    取消
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>标记为精选</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300" 
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                    />
                    <span>添加到首页精选商品</span>
                  </label>
                  <Separator />
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300" 
                      checked={isNew}
                      onChange={(e) => setIsNew(e.target.checked)}
                    />
                    <span>新品</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300" 
                      checked={isHot}
                      onChange={(e) => setIsHot(e.target.checked)}
                    />
                    <span>热销</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300" 
                      checked={isPromotion}
                      onChange={(e) => setIsPromotion(e.target.checked)}
                    />
                    <span>促销</span>
                  </label>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
