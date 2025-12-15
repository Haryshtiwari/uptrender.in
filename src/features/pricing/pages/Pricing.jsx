import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Switch,
  Chip,
  Stack,
  Container,
  useTheme,
  alpha,
  Skeleton,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Rocket,
  Diamond,
  Star,
  TrendingUp,
  Speed,
  Security,
} from '@mui/icons-material';
import PageContainer from '../../../components/common/PageContainer';
import { useToast } from '../../../hooks/useToast';
import planService from '../../../services/planService';

const Pricing = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isYearly, setIsYearly] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await planService.getPlanCatalog();
      if (response?.success && response?.data && response.data.length > 0) {
        const transformedPlans = response.data
          .filter(plan => plan.isActive)
          .map(plan => ({
            id: plan.id,
            name: plan.name,
            price: parseFloat(plan.price) || 0,
            monthlyPrice: parseFloat(plan.price) || 0,
            yearlyPrice: parseFloat(plan.price) * 10 || 0,
            description: plan.description,
            planType: plan.planType,
            popular: plan.isPopular,
            walletBalance: parseFloat(plan.walletBalance) || 0,
            duration: plan.duration,
            durationType: plan.durationType,
            maxStrategies: plan.maxStrategies,
            maxTrades: plan.maxTrades,
            apiAccess: plan.apiAccess,
            priority: plan.priority,
            features: Array.isArray(plan.features) 
              ? plan.features.map(feature => ({
                  text: typeof feature === 'string' ? feature : feature.text || String(feature),
                  included: true
                }))
              : []
          }));
        setPlans(transformedPlans);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconForPlanType = (planType) => {
    switch (planType) {
      case 'basic': return <Rocket sx={{ fontSize: 28 }} />;
      case 'professional': return <Star sx={{ fontSize: 28 }} />;
      case 'enterprise': return <Diamond sx={{ fontSize: 28 }} />;
      default: return <Rocket sx={{ fontSize: 28 }} />;
    }
  };

  const getColorForPlanType = (planType) => {
    switch (planType) {
      case 'basic': return theme.palette.info.main;
      case 'professional': return theme.palette.primary.main;
      case 'enterprise': return theme.palette.warning.main;
      default: return theme.palette.info.main;
    }
  };

  const defaultPlans = [
    {
      id: 1,
      name: 'Basic Plan',
      price: 29.99,
      monthlyPrice: 29.99,
      yearlyPrice: 299.90,
      description: 'Perfect for beginners',
      planType: 'basic',
      popular: false,
      walletBalance: 1000,
      duration: 30,
      durationType: 'days',
      maxStrategies: 5,
      maxTrades: 100,
      apiAccess: false,
      priority: 'standard',
      features: [
        { text: '5 Active Strategies', included: true },
        { text: 'Paper Trading', included: true },
        { text: 'Basic Analytics', included: true },
        { text: 'Email Support', included: true },
        { text: 'Live Trading', included: false },
        { text: 'API Access', included: false },
      ],
    },
    {
      id: 2,
      name: 'Professional Plan',
      price: 79.99,
      monthlyPrice: 79.99,
      yearlyPrice: 799.90,
      description: 'For serious traders',
      planType: 'professional',
      popular: true,
      walletBalance: 5000,
      duration: 30,
      durationType: 'days',
      maxStrategies: 20,
      maxTrades: 1000,
      apiAccess: true,
      priority: 'high',
      features: [
        { text: '20 Active Strategies', included: true },
        { text: 'Live Trading', included: true },
        { text: 'Advanced Analytics', included: true },
        { text: 'API Access', included: true },
        { text: 'Priority Support', included: true },
        { text: 'Strategy Backtesting', included: true },
      ],
    },
    {
      id: 3,
      name: 'Enterprise Plan',
      price: 199.99,
      monthlyPrice: 199.99,
      yearlyPrice: 1999.90,
      description: 'For professional teams',
      planType: 'enterprise',
      popular: false,
      walletBalance: 15000,
      duration: 30,
      durationType: 'days',
      maxStrategies: 999,
      maxTrades: 10000,
      apiAccess: true,
      priority: 'urgent',
      features: [
        { text: 'Unlimited Strategies', included: true },
        { text: 'Live Trading', included: true },
        { text: 'Advanced Analytics', included: true },
        { text: 'Full API Access', included: true },
        { text: '24/7 Priority Support', included: true },
        { text: 'Dedicated Account Manager', included: true },
      ],
    },
  ];

  const displayPlans = plans.length > 0 ? plans : defaultPlans;

  const handleSubscribe = (plan) => {
    if (plan.monthlyPrice === 0) {
      showToast('You are already on the Free plan', 'info');
      return;
    }
    navigate('/user/plan-info');
  };

  const getPrice = (plan) => {
    if (isYearly && plan.yearlyPrice) {
      return plan.yearlyPrice;
    }
    return plan.monthlyPrice || plan.price;
  };

  const getPricePeriod = (plan) => {
    if (isYearly) {
      return 'per year';
    }
    if (plan.durationType && plan.duration) {
      return `per ${plan.duration} ${plan.durationType}`;
    }
    return 'per month';
  };

  // Loading skeleton
  if (loading) {
    return (
      <PageContainer title="Pricing Plans">
        <Container maxWidth="lg">
          <Box sx={{ py: 4 }}>
            <Stack spacing={2} alignItems="center" mb={5}>
              <Skeleton variant="text" width={400} height={60} sx={{ bgcolor: 'action.hover' }} />
              <Skeleton variant="text" width={300} height={30} sx={{ bgcolor: 'action.hover' }} />
            </Stack>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rounded" height={500} sx={{ borderRadius: 3, bgcolor: 'action.hover' }} />
              ))}
            </Box>
          </Box>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Pricing Plans" description="Choose the perfect plan for your trading needs">
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 3, md: 4 } }}>
          {/* Header */}
          <Stack spacing={2} alignItems="center" mb={5}>
            <Typography 
              variant="h2" 
              fontWeight={800} 
              textAlign="center"
              sx={{ 
                fontSize: { xs: '2rem', md: '2.75rem' },
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.info.main} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Choose Your Trading Plan
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              textAlign="center"
              sx={{ maxWidth: 500 }}
            >
              Start trading with the plan that suits your needs. Upgrade or downgrade anytime.
            </Typography>
            
            {/* Billing Toggle */}
            <Box 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                p: 1,
                px: 2,
              }}
            >
              <Typography 
                variant="body2" 
                fontWeight={!isYearly ? 600 : 400}
                color={!isYearly ? 'primary.main' : 'text.secondary'}
              >
                Monthly
              </Typography>
              <Switch
                checked={isYearly}
                onChange={(e) => setIsYearly(e.target.checked)}
                color="primary"
                size="small"
              />
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography 
                  variant="body2" 
                  fontWeight={isYearly ? 600 : 400}
                  color={isYearly ? 'primary.main' : 'text.secondary'}
                >
                  Yearly
                </Typography>
                {isYearly && (
                  <Chip
                    label="Save 17%"
                    color="success"
                    size="small"
                    sx={{ fontWeight: 600, height: 22, fontSize: '0.7rem' }}
                  />
                )}
              </Stack>
            </Box>
          </Stack>

          {/* Pricing Cards */}
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: `repeat(${Math.min(displayPlans.length, 4)}, 1fr)`,
              },
              gap: 3,
            }}
          >
            {displayPlans.map((plan) => {
              const price = getPrice(plan);
              const planColor = getColorForPlanType(plan.planType);
              const isPopular = plan.popular;
              
              return (
                <Card
                  key={plan.id || plan.name}
                  sx={{
                    position: 'relative',
                    height: '100%',
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: isPopular ? 'primary.main' : 'divider',
                    borderRadius: 3,
                    overflow: 'visible',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: isPopular 
                        ? `0 20px 40px ${alpha(theme.palette.primary.main, 0.3)}`
                        : `0 20px 40px ${alpha(theme.palette.common.black, 0.2)}`,
                      borderColor: isPopular ? 'primary.main' : 'primary.light',
                    },
                  }}
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1,
                      }}
                    >
                      <Chip
                        label="MOST POPULAR"
                        color="primary"
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          height: 24,
                          px: 1,
                        }}
                      />
                    </Box>
                  )}

                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Plan Icon & Name */}
                    <Stack spacing={2} alignItems="center" mb={3}>
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: 2,
                          bgcolor: alpha(planColor, 0.15),
                          color: planColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {getIconForPlanType(plan.planType)}
                      </Box>
                      
                      <Box textAlign="center">
                        <Typography variant="h5" fontWeight={700} gutterBottom>
                          {plan.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>
                          {plan.description}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Price */}
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Stack direction="row" alignItems="flex-start" justifyContent="center" spacing={0.5}>
                        <Typography 
                          variant="h6" 
                          fontWeight={600} 
                          sx={{ mt: 1 }}
                          color={isPopular ? 'primary.main' : 'text.primary'}
                        >
                          $
                        </Typography>
                        <Typography
                          variant="h2"
                          fontWeight={800}
                          color={isPopular ? 'primary.main' : 'text.primary'}
                          sx={{ lineHeight: 1 }}
                        >
                          {typeof price === 'number' ? price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }) : price}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {getPricePeriod(plan)}
                      </Typography>
                    </Box>

                    {/* Wallet Balance & Duration */}
                    {(plan.walletBalance > 0 || plan.duration) && (
                      <Box 
                        sx={{ 
                          mb: 3, 
                          p: 2, 
                          bgcolor: alpha(planColor, 0.08),
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: alpha(planColor, 0.2),
                        }}
                      >
                        {plan.walletBalance > 0 && (
                          <Typography variant="body2" fontWeight={600} color={planColor}>
                            💰 Wallet Balance: ${plan.walletBalance?.toLocaleString()}
                          </Typography>
                        )}
                        {plan.duration && (
                          <Typography variant="caption" color="text.secondary">
                            Duration: {plan.duration} {plan.durationType}
                          </Typography>
                        )}
                      </Box>
                    )}

                    <Divider sx={{ mb: 2 }} />

                    {/* Trading Limits */}
                    {(plan.maxStrategies || plan.maxTrades || plan.apiAccess || plan.priority) && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: 'text.primary', mb: 1.5 }}>
                          Trading Limits
                        </Typography>
                        <Stack spacing={1}>
                          {plan.maxStrategies && (
                            <Stack direction="row" spacing={1} alignItems="center">
                              <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                              <Typography variant="body2" color="text.secondary">
                                {plan.maxStrategies >= 999 ? 'Unlimited' : plan.maxStrategies} Active Strategies
                              </Typography>
                            </Stack>
                          )}
                          {plan.maxTrades && (
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Speed sx={{ fontSize: 16, color: 'info.main' }} />
                              <Typography variant="body2" color="text.secondary">
                                {plan.maxTrades >= 10000 ? 'Unlimited' : plan.maxTrades.toLocaleString()} Trades/Month
                              </Typography>
                            </Stack>
                          )}
                          {plan.apiAccess && (
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Security sx={{ fontSize: 16, color: 'success.main' }} />
                              <Typography variant="body2" color="success.main" fontWeight={500}>
                                Full API Access
                              </Typography>
                            </Stack>
                          )}
                          {plan.priority && plan.priority !== 'standard' && (
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                              <Typography variant="body2" color="warning.main" fontWeight={500}>
                                {plan.priority.charAt(0).toUpperCase() + plan.priority.slice(1)} Priority Support
                              </Typography>
                            </Stack>
                          )}
                        </Stack>
                      </Box>
                    )}

                    {/* Features List */}
                    {plan.features && plan.features.length > 0 && (
                      <Box sx={{ mb: 3, flexGrow: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: 'text.primary', mb: 1.5 }}>
                          Features
                        </Typography>
                        <Stack spacing={1}>
                          {plan.features.map((feature, index) => (
                            <Stack 
                              key={index} 
                              direction="row" 
                              spacing={1} 
                              alignItems="center"
                            >
                              {feature.included ? (
                                <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                              ) : (
                                <Cancel sx={{ fontSize: 16, color: 'text.disabled' }} />
                              )}
                              <Typography
                                variant="body2"
                                color={feature.included ? 'text.primary' : 'text.disabled'}
                                sx={{
                                  textDecoration: feature.included ? 'none' : 'line-through',
                                }}
                              >
                                {feature.text}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {/* CTA Button */}
                    <Button
                      fullWidth
                      variant={isPopular ? 'contained' : 'outlined'}
                      color="primary"
                      size="large"
                      onClick={() => handleSubscribe(plan)}
                      sx={{
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '1rem',
                        borderRadius: 2,
                        mt: 'auto',
                        ...(isPopular && {
                          boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                          '&:hover': {
                            boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                          },
                        }),
                      }}
                    >
                      {price === 0 ? 'Current Plan' : isPopular ? 'Get Started' : 'Choose Plan'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </Box>

          {/* Bottom Note */}
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Typography variant="body2" color="text.secondary">
              All plans include a 7-day free trial. No credit card required.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Need a custom plan? <Button variant="text" size="small" sx={{ textTransform: 'none' }}>Contact us</Button>
            </Typography>
          </Box>
        </Box>
      </Container>
    </PageContainer>
  );
};

export default Pricing;
