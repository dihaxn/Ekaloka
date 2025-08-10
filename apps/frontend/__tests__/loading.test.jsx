import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from '@/components/Loading';

describe('Loading component', () => {
  it('renders brand text', () => {
    render(<Loading />);
    expect(screen.getByText(/Dai Fashion/i)).toBeInTheDocument();
  });
});
