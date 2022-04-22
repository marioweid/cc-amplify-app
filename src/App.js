import './App.css';
import { useEffect, useState } from 'react';
import { API } from 'aws-amplify'
import { Table, Button, Modal, Form } from "react-bootstrap"

const createItem = async (_name) => {
  const data = await API.post('itemApi', '/item', { body: { name: _name } })
  refreshPage()
}

const refreshPage = () => {
  window.location.reload(false);
}

function App() {
  const [items, setItems] = useState([])
  const [showNameChange, setShowNameChange] = useState(false);
  const [selectedRow, setSelectedRow] = useState({ id: "", name: "" })
  const [newName, setNewName] = useState("")
  const [newItem, setNewItem] = useState("")

  const updateItem = async (_id, _name) => {
    const data = await API.put('itemApi', `/item/${_id}`, { body: { name: _name } })
    setShowNameChange(false)
    let index = items.findIndex(o => o.id.S === _id)
    if (index > -1) {
      items[index] = { id: { S: _id }, name: { S: _name } };
    }
    refreshPage()
  }

  const deleteItem = async (itemId) => {
    const data = await API.del('itemApi', `/item/${itemId}`)
    refreshPage()
  }

  const handleCloseNameChange = () => {
    setSelectedRow({ id: "", name: "" })
    setShowNameChange(false)
  };

  const handleShowNameChange = (item) => {
    setSelectedRow(item)
    setShowNameChange(true)
  };

  const handleNameChange = e => {
    setNewName(e.target.value)
  }

  const handleNewItemChange = e => {
    setNewItem(e.target.value)
  }

  useEffect(() => {
    const getData = async () => {
      const data = await API.get('itemApi', '/item')
      setItems(data.data.Items)
    }
    getData()
  }, [])

  return (
    <div className='App'>

      <h1>Items</h1>
      <div className='m-4'>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Item Id</th>
              <th>Name</th>
              <th class="d-flex">
                <Form.Control type='text' id="newItemForm" placeholder="New item name" onChange={handleNewItemChange}/>
                <Button variant="success" className='m-1' onClick={() => createItem(newItem)}>Create</Button>
              </th>
            </tr>
          </thead>
          <tbody>

            {items.map(item => (
              <tr>
                <td>{item.id.S}</td>
                <td>{item.name.S}</td>
                <td>
                  <Button className='m-1' onClick={() => handleShowNameChange({ id: item.id.S, name: item.name.S })}>Update</Button>
                  <Button variant="danger" className='m-1' onClick={() => deleteItem(item.id.S)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

      </div>

      <Modal show={showNameChange} onHide={handleCloseNameChange}>
        <Modal.Header closeButton>
          <Modal.Title>Renaming: {selectedRow.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="nameChangeForm">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Choose a new name"
                autoFocus
                onChange={handleNameChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseNameChange}>
            Close
          </Button>
          <Button variant="primary" onClick={() => updateItem(selectedRow.id, newName)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
