import { LayoutConfig } from '@spartacus/storefront';

export const makaLayoutConfig: LayoutConfig = {
  layoutSlots: {
    header: {
      lg: {
        slots: [
          'PreHeader',
          'SiteLogo',
          'SiteLogin',
          'MiniCart'
        ],
      },
      slots: ['PreHeader', 'SiteLogo', 'MiniCart'],
    },
    navigation: {
      lg: { slots: ['SiteLogin', 'NavigationBar'] },
      slots: ['SiteLogin', 'NavigationBar'],
    },
    ProductDetailsPageTemplate: {
      lg: {
        pageFold: 'UpSelling',
      },

      pageFold: 'Summary',

      slots: [
        'Summary',
        'Tabs',
        'ProductBanner',
        'UpSelling',
        'CrossSelling',
        'PlaceholderContentSlot',
      ],
    },
    ProductListPageTemplate: {
      slots: ['PLPBannerContentSlot', 'ProductLeftRefinements', 'ProductListSlot']
    },
    ProductGridPageTemplate: {
      slots: ['PLPBannerContentSlot', 'ProductLeftRefinements', 'ProductGridSlot']
    },
    OrderConfirmationPageTemplate: {
      slots: ['OrderConfirmationBannerContentSlot', 'BodyContent']
    },
    CustomerInvitationPageTemplate: {
      slots: ['LeftContentSlot', 'RightContentSlot'],
    },
    CommissionPageTemplate: {
      slots: ['BodyContent'],
    },
    TwoColumnPageTemplate: {
      slots: ['LeftContentSlot', 'RightContentSlot'],
    },
    LandingPage2Template: {
      slots: [
        'Section1',
        'Section2C',
        'Section3A',
        'Section3B',
        'Section3C',
        'Section4',
        'Section5',
      ]
    }
  }
};
