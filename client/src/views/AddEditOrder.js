import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';

function AddEditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [Order, setOrder] = useState('');
  const [Date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [Products, setProducts] = useState('');
  const [FinalPrice, setFinalPrice] = useState('');
  const [Status, setStatus] = useState('');
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (id !== '0') {
      setEdit(true);
      Axios.get(`http://127.0.0.1:3001/orders/${id}`).then((response) => {
        const order = response.data;
        setOrder(order.Order);
        setDate(moment(order.Date).format('YYYY-MM-DD'));
        setProducts(order.Products);
        setFinalPrice(order.FinalPrice);
        setStatus(order.Status);
      }).catch((error) => {
        Swal.fire({
          title: 'Error!',
          text: `Failed to fetch order: ${error.message}`,
          icon: 'error',
          timer: 2000,
        });
      });
    }
  }, [id]);

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const orderData = {
      Order,
      Date,
      Products,
      FinalPrice,
      Status,
    };

    if (edit) {
      Axios.put(`http://127.0.0.1:3001/update/${id}`, orderData).then(() => {
        Swal.fire({
          title: '<strong>Successful update!!</strong>',
          html: `<i>The order ${Order} was updated satisfactorily</i>`,
          icon: 'success',
          timer: 2000,
        });
        navigate('/');
      }).catch((error) => {
        Swal.fire({
          title: 'Error!',
          text: `Failed to update order: ${error.message}`,
          icon: 'error',
          timer: 2000,
        });
      });
    } else {
      Axios.post('http://127.0.0.1:3001/create', orderData).then(() => {
        Swal.fire({
          title: '<strong>Successful register!!</strong>',
          html: `<i>The order ${Order} was registered satisfactorily</i>`,
          icon: 'success',
          timer: 2000,
        });
        navigate('/');
      }).catch((error) => {
        Swal.fire({
          title: 'Error!',
          text: `Failed to create order: ${error.message}`,
          icon: 'error',
          timer: 2000,
        });
      });
    }
  };

  const cancel = () => {
    navigate('/');
  };

  return (
    <div className='container'>
      <div className='card text-center'>
        <div className='card-header'>
          {edit ? 'Edit Order' : 'Add Order'}
        </div>
        <div className='card-body'>
          <form onSubmit={handleSubmit}>
            <div className='input-group mb-3'>
              <span className='input-group-text' id='basic-addon1'>Order #</span>
              <input
                type='number'
                onChange={(event) => setOrder(event.target.value)}
                className='form-control'
                value={Order}
                placeholder='Order'
                aria-label='Order'
                aria-describedby='basic-addon1'
              />
            </div>

            <div className='input-group mb-3'>
              <span className='input-group-text' id='basic-addon1'>Date:</span>
              <input
                type='date'
                onChange={(event) => setDate(event.target.value)}
                className='form-control'
                value={Date}
                placeholder='Date'
                aria-label='Date'
                aria-describedby='basic-addon1'
              />
            </div>

            <div className='input-group mb-3'>
              <span className='input-group-text' id='basic-addon1'>Products:</span>
              <input
                type='number'
                onChange={(event) => setProducts(event.target.value)}
                className='form-control'
                value={Products}
                placeholder='Products'
                aria-label='Products'
                aria-describedby='basic-addon1'
              />
            </div>

            <div className='input-group mb-3'>
              <span className='input-group-text' id='basic-addon1'>Final Price:</span>
              <input
                type='text'
                onChange={(event) => setFinalPrice(event.target.value)}
                className='form-control'
                value={FinalPrice}
                placeholder='Final Price'
                aria-label='Final Price'
                aria-describedby='basic-addon1'
              />
            </div>

            <div className='input-group mb-3'>
              <label className='input-group-text'>Status:</label>
              <select
                className='form-select'
                value={Status}
                id='inputGroupSelect01'
                onChange={handleStatusChange}
              >
                <option value='Pending'>Pending</option>
                <option value='In Progress'>In Progress</option>
                <option value='Completed'>Completed</option>
              </select>
            </div>

            <div className='card-footer text-body-secondary'>
              <button type='submit' className={`btn ${edit ? 'btn-warning' : 'btn-success'}`}>
                {edit ? 'Update' : 'Register'}
              </button>
              <button type='button' className='btn btn-info ml-2' onClick={cancel}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddEditOrder;
