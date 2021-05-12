import { render, screen } from '@testing-library/react';
import App from './App';
import Authentication from './components/Authorization/Authentication';

test('renders learn react link', () => {
  render(<Authentication />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
