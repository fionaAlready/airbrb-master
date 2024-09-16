import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Image, Typography, Space, Rate, Divider, Card, DatePicker, Button, List, Tag, message,Row,Col } from 'antd'
import axios from '../../utils/request'
import dayjs from 'dayjs'
import ReviewModal from './ReviewModal '

import './list-view.css'
import Logout from '../hoc/logOut'

const { Title, } = Typography
const { RangePicker } = DatePicker

const BookStatus = {
  accepted: 'success',
  pending: 'processing',
  declined: 'error',
}

function ListingView () {

  const { listingId } = useParams()
  const [searchParams] = useSearchParams()
  const checkIn = searchParams.get('check_in')
  const checkOut = searchParams.get('check_out')

  const [token] = useState(localStorage.getItem('token'))
  const email = localStorage.getItem('email')

  const [listingItem, setListingItem] = useState({})
  const [selectDate, setSelectDate] = useState(() => (checkIn ? [dayjs(checkIn), dayjs(checkOut)] : []))
  const [bookings, setBookings] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [bookingid, setBookingid] = useState()

  const getListingView = async () => {
    const res = await axios.get(`/listings/${listingId}`)
    const { data } = res
    setListingItem(data.listing)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }
  useEffect(() => {
    getListingView()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getAllBookings = async () => {
    const { data: res } = await axios.get('/bookings')
    setBookings(res.bookings.filter((book) => book.owner === email))
  }

  useEffect(() => {
    token && getAllBookings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const onChange = (value, dateString) => {
    setSelectDate(value)
  }
  const due = useMemo(() => selectDate[1]?.diff(selectDate[0], 'day'), [selectDate])

  const handelReserve = async () => {
    try {
      await axios.post(`/bookings/new/${listingId}`, {
        dateRange: { checkIn: selectDate[0].format('YYYY-MM-DD'), checkOut: selectDate[1].format('YYYY-MM-DD') },
        totalPrice: listingItem.price * due,
      })
      message.success('Reserve Success!')
      getAllBookings()
    } catch (error) {
      console.error('🚀 ~ file: ListingView.js:81 ~ handelReserve ~ error:', error)
      message.error('Reserve Error! ' + error.response?.data?.error)
    }
  }

  const handelReview = (item) => {
    setBookingid(item.id)
    setIsModalOpen(true)
  }
  return (
    <div className="listing-wrap">
      <div className='header'>
         <Logout/>
      </div>
      <section className="listing-view-wrap mt-16">
        <Row type={'flex'}  justify={'center'} align={'middle'}>
           <Col lg={12} xs={24}>
           <Typography style={{ flex:1 }}>
            <Title>{listingItem.title}</Title>
            <Title level={3}>{listingItem.address}</Title>
            <Title level={3}>{listingItem.metadata?.type}</Title>
            <Space split=" · ">
              Detail
              <span>{listingItem.metadata?.numberOfBedrooms} bedrooms</span>
              <span>{listingItem.metadata?.propertyAmenities} amenities</span>
              <span>{listingItem.metadata?.numberOfBathrooms} bathrooms</span>
            </Space>
            <Image width={'20vw'} src={listingItem.thumbnail} />
            <Divider />
            <Title level={4}>Hosted by {listingItem.owner}</Title>
            <Divider />
          </Typography>
           </Col>

           <Col alignItems={'center'}>
            
             {/* booking */}
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <h1>${listingItem.price}</h1>night
                  </div>
                }
                style={{ flex:1 }}
              >
                <RangePicker value={selectDate} format="YYYY-MM-DD" onChange={onChange} size="large" style={{ width: '100%' }} />
                {due
                  ? (
                  <>
                    {token && (
                      <Button className="mt-16" type="primary" danger size="large" block onClick={handelReserve}>
                        Reserve
                      </Button>
                    )}
                    <div className="price-info mt-16">
                      <span>{`$${listingItem.price} x ${due} nights `}</span>
                      <span>${listingItem.price * due}</span>
                    </div>
                  </>
                    )
                  : null}
              </Card>
           </Col>
        </Row>
      </section>

      {token && (
        <List
          className="mt-16 w-full"
          bordered
          dataSource={bookings}
          renderItem={(item, index) => (
            <List.Item className="booking-item">
              <span>
                Booking DateRange: {item.dateRange?.checkIn} ~ {item.dateRange?.checkOut}
              </span>
              <span style={{ width: '10%' }}>TotalPrice: {item.totalPrice}</span>
              <span>
                Status: <Tag color={BookStatus[item.status]}>{item.status}</Tag>{' '}
              </span>
              <Button size="small" disabled={item.status !== 'accepted'} onClick={() => handelReview(item)}>
                review
              </Button>
            </List.Item>
          )}
        />
      )}
      <Divider />
      {/* review */}
      <div>review</div>
      <List
        className="w-full"
        itemLayout="horizontal"
        dataSource={listingItem?.reviews}
        renderItem={(review, index) => (
          <List.Item>
            <List.Item.Meta title={<Rate disabled defaultValue={review.score} />} description={review.comment} />
          </List.Item>
        )}
      />
      <ReviewModal bookingid={bookingid} open={isModalOpen} setModalOpen={setIsModalOpen} refresh={getListingView} />
    </div>
  )
}

export default ListingView;
