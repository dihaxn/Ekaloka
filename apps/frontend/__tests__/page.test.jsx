import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

// Mock heavy child components & context
jest.mock('@/components/HeaderSlider', () => () => <div data-testid="header-slider" />);
jest.mock('@/components/HomeProducts', () => () => <div data-testid="home-products" />);
jest.mock('@/components/FeaturedProduct', () => () => <div data-testid="featured-product" />);
jest.mock('@/components/Banner', () => () => <div data-testid="banner" />);
jest.mock('@/components/NewsLetter', () => () => <div data-testid="newsletter" />);
jest.mock('@/components/Navbar', () => () => <nav data-testid="navbar" />);
jest.mock('@/components/Footer', () => () => <footer data-testid="footer" />);
jest.mock('@/components/Loading', () => () => <div data-testid="loading" />);
jest.mock('@/context/AppContext', () => ({
  useAppContext: () => ({ loading: false })
}));

describe('Home Page', () => {
  it('renders core sections when not loading', () => {
    render(<Home />);
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('header-slider')).toBeInTheDocument();
    expect(screen.getByTestId('home-products')).toBeInTheDocument();
    expect(screen.getByTestId('featured-product')).toBeInTheDocument();
    expect(screen.getByTestId('banner')).toBeInTheDocument();
    expect(screen.getByTestId('newsletter')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
