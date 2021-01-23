import React, {Component} from 'react';
import axios from 'axios';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Label } from 'reactstrap';

class App extends Component 
{
  state = {
    books: [],
    newBookData:{
      title:''
    },
    editBookData: {
      id: '',
      title: '',
      status: 'available'
    },

    newBookModal: false,
    editBookModal: false
  }

  componentDidMount()
  {
    this._refreshBooks();
  }

  toggleNewBookModal(){
    this.setState({
      newBookModal: ! this.state.newBookModal
    });
  }

  toggleEditBookModal(){
    this.setState({
      editBookModal: ! this.state.editBookModal
    });
  }

  updateBook(){
    let {title, status} = this.state.editBookData;

    axios.put('http://localhost:8080/api/book/' + this.state.editBookData.id, {
      title, status
    }).then((response) => {    
      this._refreshBooks();
      this.setState({
        editBookModal: false,
        editBookData: {
          id:'',
          title: '',
          status: 'available'
        }
      })
    });
  }

  _refreshBooks(){
    axios.get('http://localhost:8080/api/book/getAllBooks').then((response) => {
      this.setState({
        
        books: response.data

      })
    });
  }

  addBook(){
    axios.post('http://localhost:8080/api/book/', this.state.newBookData).then((response) => {
      let { books } = this.state;

      books.push(response.data);

      this.setState({ books, newBookModal: false, newBookData:{
        title:''
      } });
    })
  }

  editBook(id, title, status){
    this.setState({
      editBookData:{
        id, title, status
      },
      editBookModal: ! this.state.editBookModal
    });
    
  }


  deleteBook(id){
    
    axios.delete('http://localhost:8080/api/book/' + id).then((response) => {
      
      this._refreshBooks();
      
     
    })
  }
  render() 
  {
    let books = this.state.books.map((book) => {
      return (
        <tr key={book.id}>
            <td>{book.id}</td>
            <td>{book.title}</td>
            <td>{book.status}</td>
            <td>
              <Button color="success" size="sm" className="mr-2" onClick={this.editBook.bind(this, book.id, book.title, book.status)}>Edit</Button>
              <Button color="danger" size ="sm" onClick={this.deleteBook.bind(this, book.id)}>Delete</Button> 
            </td>
        </tr>
      )
    });
    return (
      <div className="App container">
        <h1>Books App</h1>
        <Button className="my-3" color="primary" onClick={this.toggleNewBookModal.bind(this)}>Add a new book</Button>
        <Modal isOpen={this.state.newBookModal} toggle={this.toggleNewBookModal.bind(this)}>
        <ModalHeader toggle={this.toggleNewBookModal.bind(this)}>Add a new book</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="title">Title:</Label>
            <Input id="title" placeholder="Title of a book" value={this.state.newBookData.title} onChange={(e) => {
              let { newBookData } = this.state;
              newBookData.title = e.target.value;

              this.setState({ newBookData })
            }} />
          </FormGroup>          
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.addBook.bind(this)}>Add book</Button>
          <Button color="secondary" onClick={this.toggleNewBookModal.bind(this)}>Cancel</Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={this.state.editBookModal} toggle={this.toggleEditBookModal.bind(this)}>
        <ModalHeader toggle={this.toggleEditBookModal.bind(this)}>Edit book</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="title">Title:</Label>
            <Input id="title" placeholder="Title of a book" value={this.state.editBookData.title} onChange={(e) => {
              let { editBookData } = this.state;
              editBookData.title = e.target.value;

              this.setState({ editBookData })
            }} />
          </FormGroup>       
          <FormGroup>
            <Label for="status">Status:</Label>
            <Input id="status" placeholder="status of a book" value={this.state.editBookData.status} onChange={(e) => {
              let { editBookData } = this.state;
              editBookData.status = e.target.value;

              this.setState({ editBookData })
            }} />
          </FormGroup>          
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.updateBook.bind(this)}>Update book</Button>
          <Button color="secondary" onClick={this.toggleEditBookModal.bind(this)}>Cancel</Button>
        </ModalFooter>
      </Modal>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books}
            
          </tbody>
        </Table>
      </div>
    );
  }
}

export default App;
