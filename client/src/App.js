import './App.css';
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import Swal from 'sweetalert2';
import { Route, Routes, Link, useNavigate, Navigate } from 'react-router-dom';
import AddEditOrder from './views/AddEditOrder';

function OrdersList() {
  const [OrdersList, setOrdersList] = useState([]);

  const navigate = useNavigate();

  const getOrders = () => {
    Axios.get('https://fractal-technical-test-backend.vercel.app/orders').then((response) => {
      setOrdersList(response.data);
    });
  };

  const deleteOrder = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      html: `<i>Do you want delete order id: ${id}?</i>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`https://fractal-technical-test-backend.vercel.app/delete/${id}`).then(() => {
          getOrders();
        });
        Swal.fire({
          title: 'Deleted!',
          text: `Your order id ${id} has been deleted.`,
          icon: 'success',
          timer: 3000,
        });
      }
    });
  };

  const editOrder = (order) => {
    navigate(`/add-order/${order.id}`);
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className='container'>
      <div className='card text-center'>
        <div className='card-header'>
          Order of Products
        </div>
        <div className='card-body'>
          <Link to="/add-order/0" className="btn btn-success mb-3">Register New Order</Link>
        </div>
      </div>
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col"># Order</th>
            <th scope="col">Date</th>
            <th scope="col"># Products</th>
            <th scope="col">Final Price</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {OrdersList.map((val) => (
            <tr key={val.id}>
              <th scope="row">{val.id}</th>
              <td>{val.Order}</td>
              <td>{moment(val.Date).format('YYYY/MM/DD')}</td>
              <td>{val.Products}</td>
              <td>{`S/.${val.FinalPrice}`}</td>
              <td>{val.Status}</td>
              <td>
                <div className="btn-group" role="group" aria-label="Basic example">
                  <button
                    type="button"
                    onClick={() => editOrder(val)}
                    className="btn btn-info"
                    disabled={val.Status === 'Completed'}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteOrder(val.id)}
                    className="btn btn-danger"
                    disabled={val.Status === 'Completed'}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/my-orders" />} />
      <Route path="/my-orders" element={<OrdersList />} />
      <Route path="/add-order/:id" element={<AddEditOrder />} />
    </Routes>
  );
}

export default App;
