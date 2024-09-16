import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import Home from './Home';

jest.mock('axios');

describe('Home Component', () => {
    it('renders the component with listings', async () => {
        const mockData = {
            listings: [
                { id: 1, title: 'Listing 1', address: 'Address 1', price: 100, thumbnail: 'thumbnail1.jpg' },
                { id: 2, title: 'Listing 2', address: 'Address 2', price: 150, thumbnail: 'thumbnail2.jpg' },
            ],
        };
        axios.get.mockResolvedValueOnce({ data: mockData });

        const { getByText, getByLabelText } = render(<Home />);

        await waitFor(() => {
            expect(getByText('Listing 1')).toBeInTheDocument();
            expect(getByText('Listing 2')).toBeInTheDocument();
        });

    });

    it('handles search functionality', async () => {
        const mockData = {
            listings: [
                { id: 1, title: 'Listing 1', address: 'Address 1', price: 100, thumbnail: 'thumbnail1.jpg' },
                { id: 2, title: 'Listing 2', address: 'Address 2', price: 150, thumbnail: 'thumbnail2.jpg' },
            ],
        };
        axios.get.mockResolvedValueOnce({ data: mockData });
        const { getByLabelText, getByText } = render(<Home />);
        fireEvent.change(getByLabelText('Search'), { target: { value: 'Listing 1' } });
        await waitFor(() => {
            expect(getByText('Listing 1')).toBeInTheDocument();
            expect(getByText('Listing 2')).not.toBeInTheDocument();
        });

    });

});
