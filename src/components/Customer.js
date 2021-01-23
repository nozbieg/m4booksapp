import React, {Component} from 'react';
import axios from 'axios';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Label } from 'reactstrap';

class App extends Component 
{
  state = {
    customers: [],
    newCustomerData:{
      customerName:''
    },
    editCustomerData: {
      id: '',
      customerName: ''
    },
  
    newCustomerModal: false,
    editCustomerModal: false
  }

  
  componentDidMount()
  {

    this._refreshCustomers();
  }






toggleNewCustomerModal(){
  this.setState({
    newCustomerModal: ! this.state.newCustomerModal
  });
}
addCustomer(){
  axios.post('http://localhost:8080/api/customer/createNewCustomer', this.state.newCustomerData).then((response) => {
    let { customers } = this.state;

    customers.push(response.data);

    this.setState({ customers, newCustomerModal: false, newCustomerData:{
      customerName:''
    } });
  })
}

editCustomer(id, customerName){
  this.setState({
    editCustomerData:{
      id, customerName
    },
    editCustomerModal: ! this.state.editCustomerModal
  });
  
}
_refreshCustomers(){
  axios.get('http://localhost:8080/api/customer/getAllCustomers').then((response) => {
    this.setState({
      
      customers: response.data

    })
  });
}


updateCustomer(){
  let {customerName} = this.state.editCustomerData;

  axios.put('http://localhost:8080/api/customer/updateCustomer/' + this.state.editCustomerData.id, {
    customerName
  }).then((response) => {    
    this._refreshCustomers();
    this.setState({
      editCustomerModal: false,
      editCustomerData: {
        id:'',
        customerName: ''
      }
    })
  });
}
toggleEditCustomerModal(){
  this.setState({
    editCustomerModal: ! this.state.editCustomerModal
  });
}

deleteCustomer(id){
  axios.delete('http://localhost:8080/api/customer/deleteCustomer/' + id).then((response) => {
      
      this._refreshCustomers();

    })
}

  render() 
  {


    let customers = this.state.customers.map((customer) => {
      return (
        <tr key={customer.id}>
            <td>{customer.id}</td>
            <td>{customer.customerName}</td>
            <td>
              <Button color="success" size="sm" className="mr-2" onClick={this.editCustomer.bind(this, customer.id, customer.customerName)}>Edit</Button>
              <Button color="danger" size ="sm" onClick={this.deleteCustomer.bind(this, customer.id)}>Delete</Button> 
            </td>
        </tr>
      )
    });
    return (
      <div className="App container">       

        <h1>Books App-Customer</h1>
        <Button className="my-3" color="primary" onClick={this.toggleNewCustomerModal.bind(this)}>Add a new customer</Button>

        <Modal isOpen={this.state.newCustomerModal} toggle={this.toggleNewCustomerModal.bind(this)}>
        <ModalHeader toggle={this.toggleNewCustomerModal.bind(this)}>Add a new customer</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="customerName">Name:</Label>
            <Input id="customerName" placeholder="Name of a customer" value={this.state.newCustomerData.customerName} onChange={(e) => {
              let { newCustomerData } = this.state;
              newCustomerData.customerName = e.target.value;

              this.setState({ newCustomerData })
            }} />
          </FormGroup>          
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.addCustomer.bind(this)}>Add customer</Button>
          <Button color="secondary" onClick={this.toggleNewCustomerModal.bind(this)}>Cancel</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={this.state.editCustomerModal} toggle={this.toggleEditCustomerModal.bind(this)}>
        <ModalHeader toggle={this.toggleEditCustomerModal.bind(this)}>Edit Customer</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="customerName">Name:</Label>
            <Input id="customerName" placeholder="Name of Customer" value={this.state.editCustomerData.customerName} onChange={(e) => {
              let { editCustomerData } = this.state;
              editCustomerData.customerName = e.target.value;

              this.setState({ editCustomerData })
            }} />
          </FormGroup>                     
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.updateCustomer.bind(this)}>Edit book</Button>
          <Button color="secondary" onClick={this.toggleEditCustomerModal.bind(this)}>Cancel</Button>
        </ModalFooter>
      </Modal>

      <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Customer Name</th>              
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers}
            
          </tbody>
        </Table>

      </div>
    );
  }
}

export default App;
