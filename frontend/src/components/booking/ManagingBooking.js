import React, { useEffect, useState, useMemo } from 'react'

import { useParams } from 'react-router-dom'
import axios from '../../utils/request'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { List, Tag, Button, Space, message } from 'antd'

dayjs.extend(relativeTime)

const BookStatus = {
  accepted: 'success',
  pending: 'processing',
  declined: 'error',
}

function ManagingBooking () {
  const { listingId } = useParams()
  const [listingItem, setListingItem] = useState({})

  const [bookings, setBookings] = useState([])
  const [token] = useState(localStorage.getItem('token'))


  useEffect(() => {
    getListingView()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const getListingView = async () => {
    const { data: res } = await axios.get(`/listings/${listingId}`)
    setListingItem(res.listing)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  const getAllBookings = async () => {
    const { data: res } = await axios.get('/bookings')
    setBookings(res.bookings.filter((book) => book.listingId === listingId))
  }

  useEffect(() => {
    token && getAllBookings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const handelBtnClick = async (type, bookingid) => {
    try {
      await axios.put(`bookings/${type}/${bookingid}`)
      getAllBookings()
      message.success(`${type} success!`)
    } catch (error) {
      message.error('Error: ' + error)
    }
  }

  const totalDays = useMemo(() => {
    return bookings.reduce((pre, item) => {
      if (item.status === 'accepted' && dayjs(item.dateRange.checkOut).isSame(dayjs(), 'year')) {
        pre += dayjs(item.dateRange.checkOut).diff(item.dateRange.checkIn, 'day')
      }
      return pre
    }, 0)
  }, [bookings])

  // 利润
  const totalProfits = useMemo(() => {
    return bookings.reduce((pre, item) => {
      if (item.status === 'accepted' && dayjs(item.dateRange.checkOut).isSame(dayjs(), 'year')) {
        pre += item.totalPrice
      }
      return pre
    }, 0)
  }, [bookings])

  return (
    <div>
      <h3>The listing been up online {dayjs(listingItem.postedOn).fromNow(true)}</h3>
      <h3>This year has the listing been booked for {totalDays} days</h3>
      <h3>This year the profit has this listing made you is ${totalProfits}</h3>

      <List
        className="mt-16 w-full"
        bordered
        dataSource={bookings}
        renderItem={(item, index) => (
          <List.Item>
            <span>
              Booking DateRange: {item.dateRange?.checkIn} ~ {item.dateRange?.checkOut}
            </span>
            <span style={{ width: '10%' }}>TotalPrice: {item.totalPrice}</span>
            <span>
              Status: <Tag color={BookStatus[item.status]}>{item.status}</Tag>{' '}
            </span>
            <Space>
              <Button size="small" disabled={item.status !== 'pending'} onClick={() => handelBtnClick('accept', item.id)}>
                accept
              </Button>
              <Button size="small" disabled={item.status !== 'pending'} danger onClick={() => handelBtnClick('decline', item.id)}>
                decline
              </Button>
            </Space>
          </List.Item>
        )}
      />
    </div>
  )
}

export default ManagingBooking
