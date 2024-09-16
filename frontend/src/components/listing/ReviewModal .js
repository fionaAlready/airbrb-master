import React, { useState } from 'react'
import { Rate, Modal, Input, message } from 'antd'
import { useParams } from 'react-router-dom'
import axios from '../../utils/request'

const { TextArea } = Input

const restReview = { score: null, comment: '' }

function ReviewModal ({ bookingid, open, setModalOpen, refresh }) {
  const { listingId } = useParams()

  const [review, setReview] = useState({ ...restReview })

  const handleOk = async () => {
    try {
      await axios.put(`/listings/${listingId}/review/${bookingid}`, { review })
      handleClose()
      refresh?.()
    } catch (error) {
      console.log('🚀 ~ file: ReviewModal .js:20 ~ handleOk ~ error:', error)
      message.error(error)
    }
  }

  const handleClose = () => {
    setModalOpen(false)
    setReview({ ...restReview })
  }

  const handelRateChange = (score) => {
    setReview({ ...review, score })
  }
  const handelInputChange = (e) => {
    setReview({ ...review, comment: e.target.value })
  }
  return (
    <Modal title="Basic Modal" open={open} onOk={handleOk} onCancel={handleClose}>
      <Rate onChange={handelRateChange} value={review.score} />
      <TextArea value={review.comment} rows={4} placeholder="Leaving a listing review" maxLength={6} onChange={handelInputChange} />
    </Modal>
  )
}

export default ReviewModal
