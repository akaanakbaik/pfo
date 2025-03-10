import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Link, useLocation, Route } from 'wouter';

// Define interfaces for the data
interface PageView {
  id: number;
  pageView: string;
  count: number;
  createdAt: string;
}

interface VisitorCount {
  count: number;
}

interface AuthCheckResponse {
  authenticated: boolean;
  admin?: any;
}

interface AnalyticsResponse {
  pageViews: PageView[];
}

interface TopAnalyticsResponse {
  topPageViews: PageView[];
}

interface WebsiteSettings {
  id: number;
  siteName: string;
  siteDescription: string;
  siteKeywords: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  accentColor: string;
  fontPrimary: string;
  fontSecondary: string;
  showMusicPlayer: boolean;
  musicUrl: string | null;
  enableAnimation: boolean;
  animationIntensity: string;
  updatedAt: string;
}

interface WebsiteSettingsResponse {
  settings: WebsiteSettings;
}

interface PersonalInfo {
  id: number;
  name: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  resumeUrl: string | null;
  updatedAt: string;
}

interface PersonalInfoResponse {
  info: PersonalInfo;
}

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
  displayOrder: number;
  updatedAt: string;
}

interface SocialLinksResponse {
  links: SocialLink[];
}

interface Project {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  projectUrl: string | null;
  githubUrl: string | null;
  technologies: string;
  featured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface ProjectsResponse {
  projects: Project[];
}

interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  icon: string | null;
  displayOrder: number;
  updatedAt: string;
}

interface SkillsResponse {
  skills: Skill[];
}

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { LoginCredentials } from '@shared/schema';
import { useTranslation } from 'react-i18next';
import {
  ChevronLeft,
  Settings,
  User,
  Link as LinkIcon,
  Code,
  BarChart2,
  Music,
  Palette,
  PlusCircle,
  Edit,
  Trash2,
  Upload,
  AlertCircle
} from 'lucide-react';

const LoginForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const loginSchema = z.object({
    username: z.string().min(1, t('Username is required')),
    password: z.string().min(1, t('Password is required')),
  });

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginCredentials) =>
      apiRequest('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({
        title: t('Login successful'),
        description: t('Welcome to the admin dashboard'),
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: t('Login failed'),
        description: error.message || t('Invalid credentials'),
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: LoginCredentials) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('Admin Login')}</CardTitle>
          <CardDescription>
            {t('Enter your credentials to access the admin dashboard')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Username')}</FormLabel>
                    <FormControl>
                      <Input {...field} autoComplete="username" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Password')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? t('Logging in...') : t('Login')}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button variant="link">{t('Back to home')}</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

// Analytics Dashboard Component
const AnalyticsDashboard = () => {
  const { t } = useTranslation();
  
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery<AnalyticsResponse>({
    queryKey: ['/api/admin/analytics'],
    staleTime: 60 * 1000, // 1 minute
  });

  const { data: topAnalyticsData, isLoading: isLoadingTopAnalytics } = useQuery<TopAnalyticsResponse>({
    queryKey: ['/api/admin/analytics/top'],
    staleTime: 60 * 1000, // 1 minute
  });

  const { data: visitorData, isLoading: isLoadingVisitors } = useQuery<VisitorCount>({
    queryKey: ['/api/visitors'],
    staleTime: 60 * 1000, // 1 minute
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('Analytics Dashboard')}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('Total Visitors')}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingVisitors ? (
              <div className="h-24 flex items-center justify-center">
                <p>{t('Loading...')}</p>
              </div>
            ) : (
              <div className="text-4xl font-bold">{visitorData?.count || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('Total Page Views')}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? (
              <div className="h-24 flex items-center justify-center">
                <p>{t('Loading...')}</p>
              </div>
            ) : (
              <div className="text-4xl font-bold">
                {analyticsData?.pageViews?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 0}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('Unique Pages Visited')}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? (
              <div className="h-24 flex items-center justify-center">
                <p>{t('Loading...')}</p>
              </div>
            ) : (
              <div className="text-4xl font-bold">
                {analyticsData?.pageViews?.length || 0}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('Top Page Views')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingTopAnalytics ? (
            <div className="h-24 flex items-center justify-center">
              <p>{t('Loading...')}</p>
            </div>
          ) : (
            <Table>
              <TableCaption>{t('List of most viewed pages')}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('Page')}</TableHead>
                  <TableHead className="text-right">{t('Views')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topAnalyticsData?.topPageViews?.map((pageView: any) => (
                  <TableRow key={pageView.id}>
                    <TableCell className="font-medium">{pageView.pageView}</TableCell>
                    <TableCell className="text-right">{pageView.count}</TableCell>
                  </TableRow>
                ))}
                {!topAnalyticsData?.topPageViews?.length && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">
                      {t('No page views recorded yet')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('All Page Views')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingAnalytics ? (
            <div className="h-24 flex items-center justify-center">
              <p>{t('Loading...')}</p>
            </div>
          ) : (
            <Table>
              <TableCaption>{t('Complete list of page views')}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('Page')}</TableHead>
                  <TableHead className="text-right">{t('Views')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyticsData?.pageViews?.map((pageView: any) => (
                  <TableRow key={pageView.id}>
                    <TableCell className="font-medium">{pageView.pageView}</TableCell>
                    <TableCell className="text-right">{pageView.count}</TableCell>
                  </TableRow>
                ))}
                {!analyticsData?.pageViews?.length && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">
                      {t('No page views recorded yet')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// WebsiteSettings Component
const WebsiteSettingsForm = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const { data: settingsData, isLoading: isLoadingSettings } = useQuery<WebsiteSettingsResponse>({
    queryKey: ['/api/website-settings'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const websiteSettingsSchema = z.object({
    siteName: z.string().min(1, t('Site name is required')),
    siteDescription: z.string().min(1, t('Site description is required')),
    siteKeywords: z.string().min(1, t('Site keywords are required')),
    logoUrl: z.string().optional().nullable(),
    faviconUrl: z.string().optional().nullable(),
    primaryColor: z.string().min(1, t('Primary color is required')),
    accentColor: z.string().min(1, t('Accent color is required')),
    fontPrimary: z.string().min(1, t('Primary font is required')),
    fontSecondary: z.string().min(1, t('Secondary font is required')),
    showMusicPlayer: z.boolean(),
    musicUrl: z.string().optional().nullable(),
    enableAnimation: z.boolean(),
    animationIntensity: z.string().min(1, t('Animation intensity is required')),
  });
  
  type WebsiteSettingsFormValues = z.infer<typeof websiteSettingsSchema>;
  
  const form = useForm<WebsiteSettingsFormValues>({
    resolver: zodResolver(websiteSettingsSchema),
    defaultValues: {
      siteName: '',
      siteDescription: '',
      siteKeywords: '',
      logoUrl: '',
      faviconUrl: '',
      primaryColor: '#0f172a',
      accentColor: '#a48111',
      fontPrimary: 'Playfair Display',
      fontSecondary: 'Poppins',
      showMusicPlayer: true,
      musicUrl: '',
      enableAnimation: true,
      animationIntensity: 'medium',
    },
  });
  
  useEffect(() => {
    if (settingsData?.settings) {
      form.reset({
        siteName: settingsData.settings.siteName,
        siteDescription: settingsData.settings.siteDescription,
        siteKeywords: settingsData.settings.siteKeywords,
        logoUrl: settingsData.settings.logoUrl || '',
        faviconUrl: settingsData.settings.faviconUrl || '',
        primaryColor: settingsData.settings.primaryColor,
        accentColor: settingsData.settings.accentColor,
        fontPrimary: settingsData.settings.fontPrimary,
        fontSecondary: settingsData.settings.fontSecondary,
        showMusicPlayer: settingsData.settings.showMusicPlayer,
        musicUrl: settingsData.settings.musicUrl || '',
        enableAnimation: settingsData.settings.enableAnimation,
        animationIntensity: settingsData.settings.animationIntensity,
      });
    }
  }, [settingsData, form]);
  
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: WebsiteSettingsFormValues) =>
      apiRequest('/api/admin/website-settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({
        title: t('Settings updated'),
        description: t('Website settings have been updated successfully'),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/website-settings'] });
    },
    onError: (error: any) => {
      toast({
        title: t('Update failed'),
        description: error.message || t('Failed to update website settings'),
        variant: 'destructive',
      });
    },
  });
  
  const onSubmit = (data: WebsiteSettingsFormValues) => {
    updateSettingsMutation.mutate(data);
  };
  
  if (isLoadingSettings) {
    return (
      <div className="h-24 flex items-center justify-center">
        <p>{t('Loading settings...')}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('Website Settings')}</h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('General Settings')}</CardTitle>
              <CardDescription>{t('Configure basic website information')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="siteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Site Name')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>{t('Display name for your website')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="siteDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Site Description')}</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} />
                    </FormControl>
                    <FormDescription>{t('Short description for SEO purposes')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="siteKeywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Site Keywords')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>{t('Comma-separated keywords for SEO')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('Appearance')}</CardTitle>
              <CardDescription>{t('Configure website appearance')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Primary Color')}</FormLabel>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded-full border" 
                          style={{ backgroundColor: field.value }}
                        />
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="accentColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Accent Color')}</FormLabel>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded-full border" 
                          style={{ backgroundColor: field.value }}
                        />
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fontPrimary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Primary Font')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="fontSecondary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Secondary Font')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Logo URL')}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} />
                    </FormControl>
                    <FormDescription>{t('URL to your website logo')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="faviconUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Favicon URL')}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} />
                    </FormControl>
                    <FormDescription>{t('URL to your website favicon')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('Features')}</CardTitle>
              <CardDescription>{t('Configure website features')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="enableAnimation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t('Enable Animations')}
                      </FormLabel>
                      <FormDescription>
                        {t('Toggle website animations on/off')}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {form.watch('enableAnimation') && (
                <FormField
                  control={form.control}
                  name="animationIntensity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Animation Intensity')}</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="low">{t('Low')}</option>
                          <option value="medium">{t('Medium')}</option>
                          <option value="high">{t('High')}</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="showMusicPlayer"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t('Background Music')}
                      </FormLabel>
                      <FormDescription>
                        {t('Enable background music player')}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {form.watch('showMusicPlayer') && (
                <FormField
                  control={form.control}
                  name="musicUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Music URL')}</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormDescription>{t('URL to background music file (MP3)')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={updateSettingsMutation.isPending}
            >
              {updateSettingsMutation.isPending ? t('Saving...') : t('Save Settings')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

// Profile Information Component
const PersonalInfoForm = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const { data: personalData, isLoading: isLoadingPersonalInfo } = useQuery<PersonalInfoResponse>({
    queryKey: ['/api/personal-info'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const personalInfoSchema = z.object({
    name: z.string().min(1, t('Name is required')),
    title: z.string().min(1, t('Title is required')),
    bio: z.string().min(1, t('Bio is required')),
    location: z.string().optional(),
    email: z.string().email(t('Invalid email address')).optional(),
    phone: z.string().optional(),
    avatarUrl: z.string().optional().nullable(),
    resumeUrl: z.string().optional().nullable(),
  });
  
  type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;
  
  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: '',
      title: '',
      bio: '',
      location: '',
      email: '',
      phone: '',
      avatarUrl: '',
      resumeUrl: '',
    },
  });
  
  useEffect(() => {
    if (personalData?.info) {
      form.reset({
        name: personalData.info.name,
        title: personalData.info.title,
        bio: personalData.info.bio,
        location: personalData.info.location,
        email: personalData.info.email,
        phone: personalData.info.phone,
        avatarUrl: personalData.info.avatarUrl || '',
        resumeUrl: personalData.info.resumeUrl || '',
      });
    }
  }, [personalData, form]);
  
  const updatePersonalInfoMutation = useMutation({
    mutationFn: async (data: PersonalInfoFormValues) =>
      apiRequest('/api/admin/personal-info', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({
        title: t('Profile updated'),
        description: t('Personal information has been updated successfully'),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/personal-info'] });
    },
    onError: (error: any) => {
      toast({
        title: t('Update failed'),
        description: error.message || t('Failed to update personal information'),
        variant: 'destructive',
      });
    },
  });
  
  const onSubmit = (data: PersonalInfoFormValues) => {
    updatePersonalInfoMutation.mutate(data);
  };
  
  if (isLoadingPersonalInfo) {
    return (
      <div className="h-24 flex items-center justify-center">
        <p>{t('Loading profile information...')}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('Personal Information')}</h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('Basic Information')}</CardTitle>
              <CardDescription>{t('Your main profile information')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Full Name')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Professional Title')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Bio')}</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    <FormDescription>{t('Brief description about yourself')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Location')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>{t('e.g. West Sumatra, Indonesia')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('Contact Information')}</CardTitle>
              <CardDescription>{t('Your contact details')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Email Address')}</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
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
                      <FormLabel>{t('Phone Number')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('Media')}</CardTitle>
              <CardDescription>{t('Profile image and CV/resume')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Profile Picture URL')}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} />
                    </FormControl>
                    <FormDescription>{t('URL to your profile picture')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="resumeUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Resume/CV URL')}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} />
                    </FormControl>
                    <FormDescription>{t('URL to your resume or CV (PDF)')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={updatePersonalInfoMutation.isPending}
            >
              {updatePersonalInfoMutation.isPending ? t('Saving...') : t('Save Profile')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

// Dashboard Layout with Navigation
const AdminDashboard = () => {
  const { t } = useTranslation();
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("analytics");
  
  useEffect(() => {
    // Set default path on initial load
    if (location === "/admin") {
      navigate("/admin/analytics");
    }
    
    // Set active tab based on location
    const path = location.split("/").pop();
    if (path) {
      setActiveTab(path);
    }
  }, [location, navigate]);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/admin/logout', {
        method: 'POST',
      });
    },
    onSuccess: () => {
      toast({
        title: t('Logout successful'),
        description: t('You have been logged out'),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/check'] });
      navigate('/admin');
    },
    onError: () => {
      toast({
        title: t('Logout failed'),
        description: t('Failed to logout'),
        variant: 'destructive',
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const handleTabChange = (value: string) => {
    navigate(`/admin/${value}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              <span>{t('Back to Site')}</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? t('Logging out...') : t('Logout')}
            </Button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{t('Admin Dashboard')}</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              <span className="hidden md:inline">{t('Analytics')}</span>
            </TabsTrigger>
            <TabsTrigger value="website" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline">{t('Website Settings')}</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">{t('Personal Info')}</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span className="hidden md:inline">{t('Projects')}</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              <span className="hidden md:inline">{t('Skills & Links')}</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="analytics" className="space-y-4">
            <AnalyticsDashboard />
          </TabsContent>
          
          <TabsContent value="website" className="space-y-4">
            <WebsiteSettingsForm />
          </TabsContent>
          
          <TabsContent value="profile" className="space-y-4">
            <PersonalInfoForm />
          </TabsContent>
          
          <TabsContent value="projects" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{t('Projects Management')}</h2>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                {t('Add Project')}
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>{t('My Projects')}</CardTitle>
                <CardDescription>{t('Manage your portfolio projects')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{t('Project management features coming soon...')}</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="skills" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{t('Skills & Social Links')}</h2>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>{t('Skills & Social Media')}</CardTitle>
                <CardDescription>{t('Manage your skills and social media links')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{t('Skills and social links management features coming soon...')}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const { data: authData, isLoading: isCheckingAuth } = useQuery<AuthCheckResponse>({
    queryKey: ['/api/admin/check'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (!isCheckingAuth) {
      setIsAuthenticated(authData?.authenticated || false);
    }
  }, [authData, isCheckingAuth]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? (
    <AdminDashboard />
  ) : (
    <LoginForm onSuccess={() => setIsAuthenticated(true)} />
  );
};

export default AdminPage;