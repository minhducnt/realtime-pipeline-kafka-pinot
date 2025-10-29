'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../molecules/card'
import { Badge } from '../atoms/badge'
import { Button } from '../atoms/button'
import {
  Clock,
  Sparkles,
  Rocket,
  Zap,
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar,
  Filter,
  Download,
  MapPin,
  Users,
  DollarSign,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle,
  Server,
  Eye,
  Bell,
  Search,
  RefreshCw
} from 'lucide-react'

interface Feature {
  icon: React.ComponentType<any>
  title: string
  description: string
  status?: 'planned' | 'in-progress' | 'coming-soon'
}

interface UpcomingFeatureProps {
  title: string
  description: string
  features: Feature[]
  estimatedLaunch?: string
  primaryColor?: string
}

export const UpcomingFeature: React.FC<UpcomingFeatureProps> = ({
  title,
  description,
  features,
  estimatedLaunch = "Q2 2025",
  primaryColor = "primary"
}) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-500'
      case 'in-progress':
        return 'bg-yellow-500'
      case 'coming-soon':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'planned':
        return 'Planned'
      case 'in-progress':
        return 'In Progress'
      case 'coming-soon':
        return 'Coming Soon'
      default:
        return 'Upcoming'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          <Sparkles className="w-10 h-10 text-primary animate-pulse" />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse mr-3"></div>
            <span className="text-sm font-medium text-primary">Coming Soon - {estimatedLaunch}</span>
          </div>
        </div>
      </div>

      {/* Feature Preview Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                    <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  {feature.status && (
                    <Badge variant="secondary" className="text-xs">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(feature.status)} mr-1.5`}></div>
                      {getStatusText(feature.status)}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Interactive Preview Section */}
      <Card className="border-dashed border-2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Rocket className="w-5 h-5 text-primary" />
            <span>Feature Preview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Mock Data Cards */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="space-y-3">
                <div className="h-4 bg-muted rounded animate-pulse"></div>
                <div className={`h-${8 + item} bg-muted rounded animate-pulse`}></div>
                <div className="h-3 bg-muted rounded animate-pulse w-3/4"></div>
              </div>
            ))}
          </div>

          {/* Mock Chart Area */}
          <div className="mt-6 p-6 border-2 border-dashed border-muted rounded-lg bg-muted/20">
            <div className="flex items-center justify-center h-48">
              <div className="text-center space-y-4">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse w-48 mx-auto"></div>
                  <div className="h-3 bg-muted rounded animate-pulse w-32 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline/Progress Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Development Roadmap</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold">Phase 1</h4>
              <p className="text-sm text-muted-foreground">Architecture & Planning</p>
              <Badge className="bg-green-100 text-green-800">Completed</Badge>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto">
                <RefreshCw className="w-6 h-6 text-yellow-600 animate-spin" />
              </div>
              <h4 className="font-semibold">Phase 2</h4>
              <p className="text-sm text-muted-foreground">Development & Testing</p>
              <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                <Rocket className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold">Phase 3</h4>
              <p className="text-sm text-muted-foreground">Launch & Optimization</p>
              <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center space-y-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-8">
        <h3 className="text-2xl font-bold">Excited for this feature?</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          We're working hard to bring you the most comprehensive {title.toLowerCase()} experience.
          Stay tuned for updates and early access opportunities.
        </p>
        <div className="flex justify-center space-x-4">
          <Button variant="outline" disabled>
            <Bell className="w-4 h-4 mr-2" />
            Notify Me
          </Button>
          <Button variant="outline" disabled>
            <Eye className="w-4 h-4 mr-2" />
            Follow Progress
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Expected launch: {estimatedLaunch} • Sign up for updates to be notified
        </p>
      </div>
    </div>
  )
}

// Pre-configured components for different features
export const DashboardUpcoming: React.FC = () => (
  <UpcomingFeature
    title="Dashboard"
    description="Comprehensive overview of your transaction ecosystem with real-time insights and analytics"
    features={[
      {
        icon: BarChart3,
        title: 'Real-time Analytics',
        description: 'Live transaction metrics and performance indicators',
        status: 'planned'
      },
      {
        icon: TrendingUp,
        title: 'Trend Analysis',
        description: 'Historical data patterns and predictive insights',
        status: 'in-progress'
      },
      {
        icon: Activity,
        title: 'System Monitoring',
        description: 'Infrastructure health and performance metrics',
        status: 'planned'
      },
      {
        icon: Users,
        title: 'User Insights',
        description: 'Customer behavior and demographic analysis',
        status: 'planned'
      },
      {
        icon: DollarSign,
        title: 'Revenue Tracking',
        description: 'Financial performance and revenue analytics',
        status: 'coming-soon'
      },
      {
        icon: Shield,
        title: 'Risk Monitoring',
        description: 'Fraud detection and security alerts',
        status: 'in-progress'
      }
    ]}
    estimatedLaunch="Q1 2025"
  />
)

export const AnalyticsUpcoming: React.FC = () => (
  <UpcomingFeature
    title="Analytics"
    description="Powerful analytics tools to understand your transaction data with advanced visualization and insights"
    features={[
      {
        icon: TrendingUp,
        title: 'Trend Analysis',
        description: 'Deep dive into transaction patterns and historical trends',
        status: 'planned'
      },
      {
        icon: PieChart,
        title: 'Data Visualization',
        description: 'Interactive charts and graphs for comprehensive insights',
        status: 'in-progress'
      },
      {
        icon: Calendar,
        title: 'Time-based Reports',
        description: 'Flexible date ranges and custom reporting periods',
        status: 'planned'
      },
      {
        icon: Filter,
        title: 'Advanced Filtering',
        description: 'Segment data by multiple criteria and dimensions',
        status: 'coming-soon'
      },
      {
        icon: MapPin,
        title: 'Geographic Insights',
        description: 'Location-based analytics and regional performance',
        status: 'planned'
      },
      {
        icon: Users,
        title: 'Customer Segmentation',
        description: 'User behavior patterns and demographic breakdowns',
        status: 'in-progress'
      },
      {
        icon: DollarSign,
        title: 'Revenue Analytics',
        description: 'Financial performance and profitability analysis',
        status: 'planned'
      },
      {
        icon: Download,
        title: 'Export Capabilities',
        description: 'Download reports in multiple formats',
        status: 'coming-soon'
      }
    ]}
    estimatedLaunch="Q2 2025"
  />
)

export const ActivityUpcoming: React.FC = () => (
  <UpcomingFeature
    title="Activity Monitor"
    description="Real-time activity monitoring and comprehensive audit trail for all system events and transactions"
    features={[
      {
        icon: Activity,
        title: 'Live Activity Feed',
        description: 'Real-time transaction processing and system events',
        status: 'planned'
      },
      {
        icon: Zap,
        title: 'Instant Notifications',
        description: 'Push notifications for critical events and alerts',
        status: 'in-progress'
      },
      {
        icon: Eye,
        title: 'Event Monitoring',
        description: 'Comprehensive tracking of all system activities',
        status: 'planned'
      },
      {
        icon: AlertTriangle,
        title: 'Alert Management',
        description: 'Customizable alerts and notification preferences',
        status: 'coming-soon'
      },
      {
        icon: CheckCircle,
        title: 'Audit Trail',
        description: 'Complete historical record of all transactions',
        status: 'planned'
      },
      {
        icon: Users,
        title: 'User Activity',
        description: 'Track user interactions and session data',
        status: 'in-progress'
      },
      {
        icon: Server,
        title: 'System Health',
        description: 'Infrastructure monitoring and performance metrics',
        status: 'planned'
      },
      {
        icon: Search,
        title: 'Advanced Search',
        description: 'Powerful filtering and search capabilities',
        status: 'coming-soon'
      },
      {
        icon: Bell,
        title: 'Smart Alerts',
        description: 'AI-powered anomaly detection and alerts',
        status: 'planned'
      },
      {
        icon: Clock,
        title: 'Timeline View',
        description: 'Chronological activity visualization',
        status: 'in-progress'
      }
    ]}
    estimatedLaunch="Q1 2025"
  />
)
