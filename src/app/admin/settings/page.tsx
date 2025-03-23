"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
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
import {
  Settings,
  Store,
  CreditCard,
  Truck,
  Bell,
  Shield,
  Save,
  Upload,
  Globe,
  Mail,
  Phone,
  MapPin,
  Image
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define Settings interface
interface SiteSettings {
  siteName: string;
  siteDescription: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  logoUrl: string;
  faviconUrl: string;
  enableRegistration: boolean;
  enableGuestCheckout: boolean;
  showOutOfStock: boolean;
  maintenanceMode: boolean;
  analyticsCode: string;
}

// Initial settings data
const initialSettings: SiteSettings = {
  siteName: "9Rabbit 情趣用品商城",
  siteDescription: "提供优质情趣用品，让爱更美好",
  email: "contact@9rabbit.com",
  phone: "400-123-4567",
  address: "上海市浦东新区xxx路xxx号",
  currency: "CNY",
  logoUrl: "https://ext.same-assets.com/3058330213/4126874343.png",
  faviconUrl: "https://ext.same-assets.com/3058330213/2518374612.png",
  enableRegistration: true,
  enableGuestCheckout: true,
  showOutOfStock: false,
  maintenanceMode: false,
  analyticsCode: ""
};

// Define form validation schema
const generalSettingsSchema = z.object({
  siteName: z.string().min(2, {
    message: "网站名称至少需要2个字符",
  }),
  siteDescription: z.string().min(10, {
    message: "网站描述至少需要10个字符",
  }),
  email: z.string().email({
    message: "请输入有效的电子邮箱",
  }),
  phone: z.string().min(5, {
    message: "请输入有效的电话号码",
  }),
  address: z.string().min(5, {
    message: "请输入有效的地址",
  }),
  currency: z.string().min(1, {
    message: "请选择货币",
  }),
});

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);

  // Initialize form
  const form = useForm<z.infer<typeof generalSettingsSchema>>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      email: settings.email,
      phone: settings.phone,
      address: settings.address,
      currency: settings.currency,
    },
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof generalSettingsSchema>) => {
    console.log("Saved settings:", values);
    // In a real app, you would submit to an API endpoint
    setSettings({
      ...settings,
      ...values
    });
  };

  // Toggle switch handlers
  const handleToggleRegistration = (checked: boolean) => {
    setSettings({
      ...settings,
      enableRegistration: checked
    });
  };

  const handleToggleGuestCheckout = (checked: boolean) => {
    setSettings({
      ...settings,
      enableGuestCheckout: checked
    });
  };

  const handleToggleOutOfStock = (checked: boolean) => {
    setSettings({
      ...settings,
      showOutOfStock: checked
    });
  };

  const handleToggleMaintenanceMode = (checked: boolean) => {
    setSettings({
      ...settings,
      maintenanceMode: checked
    });
  };

  // Handle file uploads (mock)
  const handleLogoUpload = () => {
    // In a real app, you would upload the file to storage
    console.log("Logo upload triggered");
  };

  const handleFaviconUpload = () => {
    // In a real app, you would upload the file to storage
    console.log("Favicon upload triggered");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">网站设置</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="general" className="flex items-center">
            <Settings size={16} className="mr-2" />
            <span className="hidden sm:inline">基本设置</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center">
            <Store size={16} className="mr-2" />
            <span className="hidden sm:inline">外观设置</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center">
            <CreditCard size={16} className="mr-2" />
            <span className="hidden sm:inline">支付设置</span>
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center">
            <Truck size={16} className="mr-2" />
            <span className="hidden sm:inline">物流设置</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>基本设置</CardTitle>
              <CardDescription>
                设置网站的基本信息和联系方式
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="siteName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>网站名称</FormLabel>
                          <FormControl>
                            <Input placeholder="输入网站名称" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>货币单位</FormLabel>
                          <FormControl>
                            <Input placeholder="例如: CNY, USD" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="siteDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>网站描述</FormLabel>
                        <FormControl>
                          <Textarea placeholder="输入网站描述" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />
                  <h3 className="text-lg font-medium">联系信息</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>联系邮箱</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                              <Input className="pl-8" placeholder="contact@example.com" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>联系电话</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                              <Input className="pl-8" placeholder="400-123-4567" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>公司地址</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input className="pl-8" placeholder="输入完整地址" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />
                  <h3 className="text-lg font-medium">系统设置</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between space-x-2">
                      <div>
                        <Label htmlFor="enableRegistration" className="font-medium">
                          启用用户注册
                        </Label>
                        <p className="text-sm text-gray-500">允许访问者注册成为用户</p>
                      </div>
                      <Switch
                        id="enableRegistration"
                        checked={settings.enableRegistration}
                        onCheckedChange={handleToggleRegistration}
                      />
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                      <div>
                        <Label htmlFor="enableGuestCheckout" className="font-medium">
                          允许游客结账
                        </Label>
                        <p className="text-sm text-gray-500">无需注册即可完成购买</p>
                      </div>
                      <Switch
                        id="enableGuestCheckout"
                        checked={settings.enableGuestCheckout}
                        onCheckedChange={handleToggleGuestCheckout}
                      />
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                      <div>
                        <Label htmlFor="showOutOfStock" className="font-medium">
                          显示缺货商品
                        </Label>
                        <p className="text-sm text-gray-500">在商店中显示缺货的商品</p>
                      </div>
                      <Switch
                        id="showOutOfStock"
                        checked={settings.showOutOfStock}
                        onCheckedChange={handleToggleOutOfStock}
                      />
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                      <div>
                        <Label htmlFor="maintenanceMode" className="font-medium">
                          维护模式
                        </Label>
                        <p className="text-sm text-gray-500">暂时关闭网站，显示维护页面</p>
                      </div>
                      <Switch
                        id="maintenanceMode"
                        checked={settings.maintenanceMode}
                        onCheckedChange={handleToggleMaintenanceMode}
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="bg-[#4ea4ad] hover:bg-[#3d8b93]">
                      <Save size={16} className="mr-1" />
                      保存设置
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>外观设置</CardTitle>
              <CardDescription>
                自定义网站的外观和品牌形象
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="logo" className="font-medium">
                      网站 Logo
                    </Label>
                    <p className="text-sm text-gray-500 mb-2">建议尺寸: 200px × 50px</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="relative h-16 w-32 bg-gray-100 rounded overflow-hidden">
                      {settings.logoUrl && (
                        <img
                          src={settings.logoUrl}
                          alt="Logo"
                          className="object-contain w-full h-full"
                        />
                      )}
                    </div>
                    <Button variant="outline" onClick={handleLogoUpload}>
                      <Upload size={16} className="mr-1" />
                      上传Logo
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="favicon" className="font-medium">
                      网站图标 (Favicon)
                    </Label>
                    <p className="text-sm text-gray-500 mb-2">建议尺寸: 32px × 32px</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="relative h-10 w-10 bg-gray-100 rounded overflow-hidden">
                      {settings.faviconUrl && (
                        <img
                          src={settings.faviconUrl}
                          alt="Favicon"
                          className="object-contain w-full h-full"
                        />
                      )}
                    </div>
                    <Button variant="outline" onClick={handleFaviconUpload}>
                      <Upload size={16} className="mr-1" />
                      上传图标
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label htmlFor="analyticsCode" className="font-medium">
                    统计代码
                  </Label>
                  <p className="text-sm text-gray-500 mb-2">
                    添加谷歌分析或百度统计等代码
                  </p>
                </div>
                <Textarea
                  id="analyticsCode"
                  placeholder="粘贴统计代码"
                  value={settings.analyticsCode}
                  onChange={(e) => setSettings({...settings, analyticsCode: e.target.value})}
                  className="font-mono text-xs h-32"
                />
              </div>

              <div className="pt-4">
                <Button className="bg-[#4ea4ad] hover:bg-[#3d8b93]">
                  <Save size={16} className="mr-1" />
                  保存设置
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>支付设置</CardTitle>
              <CardDescription>
                配置支付方式和支付接口
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center rounded-full bg-gray-100 p-6">
                  <CreditCard size={32} className="text-gray-500" />
                </div>
                <h3 className="mt-4 text-lg font-medium">支付设置即将上线</h3>
                <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                  我们正在开发支付设置功能，包括支付宝、微信支付、银联等多种支付方式的配置。敬请期待！
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>物流设置</CardTitle>
              <CardDescription>
                配置物流方式和运费规则
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center rounded-full bg-gray-100 p-6">
                  <Truck size={32} className="text-gray-500" />
                </div>
                <h3 className="mt-4 text-lg font-medium">物流设置即将上线</h3>
                <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                  我们正在开发物流设置功能，包括快递公司、运费规则、配送区域等设置。敬请期待！
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
