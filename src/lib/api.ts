import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// 创建 axios 实例
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 获取存储的 token
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // 如果有token，添加到请求头
    if (token && config.headers) {
      // 1. 检查token是否为空字符串
      if (token.trim() === '') {
        console.error(`请求拦截器: ${config.url} - token为空字符串`, {
          requestUrl: config.url,
          requestMethod: config.method
        });
        
        if (typeof window !== 'undefined') {
          // 清除无效token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } else {
        // 2. 确保token格式正确，以Bearer开头
        let formattedToken = token;
        if (!token.startsWith('Bearer ')) {
          formattedToken = `Bearer ${token}`;
        }
        
        // 3. 添加到请求头
        config.headers.Authorization = formattedToken;
        
        // 4. 记录请求信息，保护隐私
        const maskedToken = formattedToken.substring(0, 15) + '[已隐藏]';
        console.log(`请求拦截器: ${config.url} - 添加认证头`, { 
          hasToken: true, 
          tokenLength: token.length,
          maskedToken,
          requestUrl: config.url,
          requestMethod: config.method
        });
      }
    } else {
      console.warn(`请求拦截器: ${config.url} - 请求未携带认证token`, { 
        hasToken: !!token, 
        requestUrl: config.url,
        requestMethod: config.method
      });
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`API响应成功: ${response.config.url}`, {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url
    });
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      console.error(`API响应错误: ${error.config?.url}`, {
        url: error.config?.url,
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
      
      // 认证错误处理
      if (error.response.status === 401) {
        console.error('认证失败: 401未授权', {
          url: error.config?.url,
          method: error.config?.method
        });
        
        if (typeof window !== 'undefined') {
          // 清除认证数据
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // 显示错误通知 (如果有全局通知系统)
          if (window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('auth-error', { 
              detail: { message: '您的登录已过期，请重新登录' } 
            }));
          }
          
          // 不自动跳转，而是由组件处理跳转，避免中断用户操作
          // window.location.href = '/account';
        }
      } else if (error.response.status === 403) {
        console.error('权限错误: 403禁止访问', {
          url: error.config?.url,
          method: error.config?.method
        });
        
        // 权限不足通知
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('auth-error', { 
            detail: { message: '您没有执行此操作的权限' } 
          }));
        }
      }
    } else if (error.request) {
      // 请求发送但没有收到响应
      console.error('API请求无响应:', {
        url: error.config?.url,
        method: error.config?.method
      });
    } else {
      // 请求设置时发生的错误
      console.error('API请求错误:', {
        message: error.message,
        url: error.config?.url
      });
    }
    
    return Promise.reject(error);
  }
);

// 认证相关API
export const authAPI = {
  // 用户注册
  register: async (userData: { email: string; password: string; name?: string; phone?: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  // 用户登录
  login: async (credentials: { email: string; password: string }) => {
    console.log('发送登录请求:', {
      url: `${api.defaults.baseURL}/auth/login`,
      credentials: { email: credentials.email, password: '***' }
    });
    const response = await api.post('/auth/login', credentials);
    console.log('登录响应:', response.data);
    return response.data;
  },
  
  // 退出登录
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  // 修改密码
  changePassword: async (passwordData: { currentPassword: string; newPassword: string }) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },
  
  // 忘记密码
  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  
  // 重置密码
  resetPassword: async (resetData: { token: string; newPassword: string }) => {
    const response = await api.post('/auth/reset-password', resetData);
    return response.data;
  }
};

// 用户相关API
export const userAPI = {
  // 获取用户资料
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },
  
  // 更新用户资料
  updateProfile: async (profileData: { name?: string; phone?: string; avatar?: string }) => {
    const response = await api.put('/user/profile', profileData);
    return response.data;
  },
  
  // 获取用户地址列表
  getAddresses: async () => {
    const response = await api.get('/user/addresses');
    return response.data;
  },
  
  // 创建新地址
  createAddress: async (addressData: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault?: boolean;
  }) => {
    const response = await api.post('/user/addresses', addressData);
    return response.data;
  },
  
  // 更新地址
  updateAddress: async (addressId: string, addressData: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    isDefault?: boolean;
  }) => {
    const response = await api.put(`/user/addresses/${addressId}`, addressData);
    return response.data;
  },
  
  // 删除地址
  deleteAddress: async (addressId: string) => {
    const response = await api.delete(`/user/addresses/${addressId}`);
    return response.data;
  },
  
  // 获取用户订单列表
  getOrders: async () => {
    const response = await api.get('/user/orders');
    return response.data;
  },
  
  // 获取用户收藏商品列表
  getFavorites: async () => {
    const response = await api.get('/user/favorites');
    return response.data;
  },
  
  // 添加收藏商品
  addFavorite: async (productId: string) => {
    const response = await api.post('/user/favorites', { productId });
    return response.data;
  },
  
  // 删除收藏商品
  removeFavorite: async (productId: string) => {
    const response = await api.delete(`/user/favorites/${productId}`);
    return response.data;
  }
};

// 商品相关API
export const productAPI = {
  // 获取所有商品
  getAllProducts: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    order?: string;
    featured?: boolean;
  }) => {
    const response = await api.get('/products', { params });
    return response.data;
  },
  
  // 获取推荐商品
  getFeaturedProducts: async (limit?: number) => {
    const response = await api.get('/products/featured', { params: { limit } });
    return response.data;
  },
  
  // 搜索商品
  searchProducts: async (query: string) => {
    const response = await api.get('/products/search', { params: { query } });
    return response.data;
  },
  
  // 获取商品详情
  getProductById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  // 创建新商品（管理员功能）
  createProduct: async (productData: {
    name: string;
    description: string;
    price: number;
    comparePrice?: number;
    stock: number;
    images: string[];
    categoryId: string;
    featured?: boolean;
  }) => {
    const response = await api.post('/products', productData);
    return response.data;
  },
  
  // 更新商品（管理员功能）
  updateProduct: async (id: string, productData: {
    name?: string;
    description?: string;
    price?: number;
    comparePrice?: number;
    stock?: number;
    images?: string[];
    categoryId?: string;
    featured?: boolean;
  }) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },
  
  // 删除商品（管理员功能）
  deleteProduct: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};

// 分类相关API
export const categoryAPI = {
  // 获取所有分类
  getAllCategories: async (includeProducts?: boolean) => {
    const response = await api.get('/categories', { 
      params: { includeProducts: includeProducts ? 'true' : 'false' } 
    });
    return response.data;
  },
  
  // 获取分类详情
  getCategoryById: async (id: string) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
  
  // 获取分类下的商品
  getCategoryProducts: async (id: string, params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: string;
  }) => {
    const response = await api.get(`/categories/${id}/products`, { params });
    return response.data;
  },
  
  // 创建新分类（管理员功能）
  createCategory: async (categoryData: {
    name: string;
    image?: string;
    parentId?: string;
  }) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },
  
  // 更新分类（管理员功能）
  updateCategory: async (id: string, categoryData: {
    name?: string;
    image?: string;
    parentId?: string;
  }) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },
  
  // 删除分类（管理员功能）
  deleteCategory: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};

export default api; 