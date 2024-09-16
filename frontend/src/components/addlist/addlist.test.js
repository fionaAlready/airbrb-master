// AddList.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import AddList from './AddList';

jest.mock('axios');

describe('AddList Component', () => {
    it('submits the form successfully', async () => {
        const mockData = { listingId: 111 };
        axios.post.mockResolvedValueOnce({ data: mockData });

        const { getByLabelText, getByText } = render(<AddList />);

        // Submit the form
        fireEvent.click(getByText('Submit'));

        // Wait for the asynchronous operation (axios.post) to complete
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:5005/listings/new',
                expect.objectContaining({
                    title: 'Test Title',
                    address: 'Test Address',
                }),
                expect.any(Object)
            );
        });
    });
});
