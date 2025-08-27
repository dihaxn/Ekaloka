// Assets configuration and data
export const assets = {
  // Fashion images
  fashion_hero: '/images/fashion-hero.jpg',
  fashion_collection: '/images/fashion-collection.jpg',
  fashion_model: '/images/fashion-model.jpg',
  fashion_accessories: '/images/fashion-accessories.jpg',
  fashion_lifestyle: '/images/fashion-lifestyle.jpg',
  
  // Image paths for the application
  jbl_soundbox_image: '/images/jbl_soundbox_image.svg',
  md_controller_image: '/images/md_controller_image.svg',
  sm_controller_image: '/images/sm_controller_image.svg',
  apple_earphone_image: '/images/apple_earphone_image.svg',
  girl_with_earphone_image: '/images/girl_with_earphone_image.svg',
  girl_with_headphone_image: '/images/girl_with_headphone_image.svg',
  header_headphone_image: '/images/girl_with_headphone_image.svg',
  header_macbook_image: '/images/boy_with_laptop_image.svg',
  header_playstation_image: '/images/md_controller_image.svg',
  logo: '/images/logo.svg',
  macbook_image: '/images/boy_with_laptop_image.svg',
  projector_image: '/images/md_controller_image.svg',
  samsung_s23phone_image: '/images/boy_with_laptop_image.svg',
  sony_airbuds_image: '/images/girl_with_headphone_image.svg',
  venu_watch_image: '/images/jbl_soundbox_image.svg',
  boy_with_laptop_image: '/images/boy_with_laptop_image.svg',
  // Product detail images
  product_details_page_apple_earphone_image1: '/images/product_details_page_apple_earphone_image1.png',
  product_details_page_apple_earphone_image2: '/images/product_details_page_apple_earphone_image2.png',
  product_details_page_apple_earphone_image3: '/images/product_details_page_apple_earphone_image3.png',
  product_details_page_apple_earphone_image4: '/images/product_details_page_apple_earphone_image4.png',
  product_details_page_apple_earphone_image5: '/images/product_details_page_apple_earphone_image5.png',
  // Icons
  add_icon: '/images/add_icon.png',
  arrow_icon: '/images/arrow_icon.svg',
  arrow_icon_white: '/images/arrow_icon_white.svg',
  arrow_right_icon_colored: '/images/arrow_right_icon_colored.svg',
  box_icon: '/images/box_icon.svg',
  cart_icon: '/images/cart_icon.svg',
  checkmark: '/images/checkmark.png',
  decrease_arrow: '/images/decrease_arrow.svg',
  facebook_icon: '/images/facebook_icon.svg',
  heart_icon: '/images/heart_icon.svg',
  increase_arrow: '/images/increase_arrow.svg',
  instagram_icon: '/images/instagram_icon.svg',
  menu_icon: '/images/menu_icon.svg',
  my_location_image: '/images/my_location_image.svg',
  order_icon: '/images/order_icon.png',
  parcel_icon: '/images/parcel_icon.svg',
  product_list_icon: '/images/product_list_icon.svg',
  redirect_icon: '/images/redirect_icon.svg',
  search_icon: '/images/search_icon.svg',
  star_dull_icon: '/images/star_dull_icon.svg',
  star_icon: '/images/star_icon.svg',
  twitter_icon: '/images/twitter_icon.svg',
  upload_area: '/images/upload_area.png',
  user_icon: '/images/user_icon.svg',
  placeholder_image: '/images/placeholder_image.svg'
};

// Dummy data for testing
export const addressDummyData = [
  {
    fullName: "John Doe",
    area: "Downtown",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    phone: "+1-555-0123"
  },
  {
    fullName: "Jane Smith",
    area: "Uptown",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90210",
    phone: "+1-555-0456"
  }
];

// Additional dummy data for other components
export const orderDummyData = [
  {
    id: "1",
    orderNumber: "ORD-001",
    date: "2025-08-25",
    status: "Delivered",
    amount: 299.99,
    items: [
      {
        product: { name: "Premium Wireless Headphones" },
        quantity: 1
      },
      {
        product: { name: "Gaming Controller" },
        quantity: 2
      }
    ],
    address: {
      fullName: "John Doe",
      area: "Downtown",
      city: "New York",
      state: "NY",
      phoneNumber: "+1-555-0123"
    }
  },
  {
    id: "2", 
    orderNumber: "ORD-002",
    date: "2025-08-24",
    status: "Processing",
    amount: 149.99,
    items: [
      {
        product: { name: "Laptop Computer" },
        quantity: 1
      }
    ],
    address: {
      fullName: "Jane Smith",
      area: "Uptown",
      city: "Los Angeles",
      state: "CA",
      phoneNumber: "+1-555-0456"
    }
  }
];

export const productsDummyData = [
  {
    id: "1",
    name: "Premium Fashion Collection",
    price: 199.99,
    image: "/images/fashion-accessories.jpg"
  },
  {
    id: "2",
    name: "Lifestyle Fashion Bundle",
    price: 299.99,
    image: "/images/fashion-lifestyle.jpg"
  }
];

export default assets;
