import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Grid,Row,Col} from 'react-flexbox-grid';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button'; 
import SaveIcon from '@material-ui/icons/Save';
import ControlPoint from '@material-ui/icons/ControlPoint';

import {Table,Modal,ModalHeader,ModalBody,ModalFooter} from 'reactstrap';
import axios from 'axios';
import moment from 'moment';

const url = "https://rayentutorialtestapp.azurewebsites.net/tutorials";

/*
{
        "id": 1880,
        "nombre": "Titulo Tester",
        "profesor": "Profesor Test",
        "materia": "Materia tester",
        "fecha": "2020-09-19T00:00:00.000Z",
        "materia_id": null
    },
*/

class App extends React.Component {


  state = {
    data: [],
    isLoadData: false,
    mensajeEspera: 'Cargando...',
    modalNuevoOpen: false,
    order: 'titulo',
    
  };

  //Funciones

  obtenerTutoriales=async(descripcion)=>{
    console.log("Comienza busqueda");
    if(!descripcion === ""){
      url = url+"description="+descripcion;
    }

    await axios.get(url).then(response=>{ 
      console.log(response.data);
      this.setState({data: response.data, isLoadData: true});      
    }).catch(error=>{
      this.setState({data: [], isLoadData: false, mensajeEspera: 'Error al cargar: '+error.message});      
    })
  }

  eliminarTutoriales(){
    var url = 'https://rayentutorialtestapp.azurewebsites.net/deletetutorials';
    axios.delete(url).then(response=>{
      this.obtenerTutoriales();
    }).catch(error=>{
      alert("Error al eliminar: "+error.message);
    })
  }

  cambiarFormatoFecha(fecha){
    var formato = "";
    var date = new Date(fecha);
    var dia = date.getDay();
    var mes = date.getMonth();
    var ano = date.getFullYear();

    var meses = []
    meses[0] = "Ene";
    meses[1] = "Feb";
    meses[2] = "Mar";
    meses[3] = "Abr";
    meses[4] = "May";
    meses[5] = "Jun";
    meses[6] = "Jul";
    meses[7] = "Ago";
    meses[8] = "Sep";
    meses[9] = "Oct";
    meses[10] = "Nov";
    meses[11] = "Dic"; 

    formato = dia +" "+ meses[mes] +" "+ ano;
    return formato;
  }

  //Manejadores
  handleSearch(event){
    var texto = event.target.value;
  }

  handleClickNuevo=()=>{
    this.mostrarModalNuevo();
  }
  mostrarModalNuevo(){    
    this.setState({modalNuevoOpen: false});
  }

  //Eventos de componente 

  componentDidMount(){
    this.obtenerTutoriales("");
  }


  render(){
    return <>
      <Grid>
        <Row>
          <AppBar position="sticky">
            <Toolbar>
              <Typography variant="h4" color="inherit">
                Tutoriales
              </Typography>
            </Toolbar>
          </AppBar>
        </Row>
        <Row>
          <br/>
        </Row>
        <Row>
          <Col xs={12} md={12}>          
            <TextField   
              id="buscador" 
              variant="outlined"
              label="Buscar por título" 
              style={{ margin: 8 }}
              fullWidth
              margin="normal"
              onChange = {this.handleSearch}/>          
          </Col>          
        </Row>
        <Row>
           
          <Col xsOffset={9} xs={3}  mdOffset={9} md={3}>
            <Row>
              <Col xs={8} md={8}>
                Ordenado por:
              </Col>
              <Col  xs={4} md={4}>
                <Select
                  labelId="selOrden"
                  id="selOrden"      
                  value={this.state.order}   
                  fullWidth    
                >
                  <MenuItem value={'titulo'}>Título</MenuItem>
                  <MenuItem value={'fecha'}>Fecha</MenuItem>
                </Select>
              </Col>
            </Row> 
          </Col>
        </Row>
        {this.state.isLoadData?
          this.state.data.map(elemento=>(
            <Row>
              <Col xs={10} md={10}>
                <h6>{elemento.nombre}</h6> 
                {elemento.profesor}
              </Col>
              <Col xs={2} md={2}>
                {this.cambiarFormatoFecha(elemento.fecha)} 
              </Col>
            </Row>
          
          ))          
          :
          <Row>{this.state.mensajeEspera}</Row>
          }
        <Row>
          <Col xsOffset={4} xs={4} md={4}>
            <Row center="xs">
              <Button variant="outlined" color="primary" onClick={this.eliminarTutoriales}>
                Eliminar Todos
              </Button>
            </Row>
          </Col>      
          <Col xs={4} md={4}>
            <Row center="xs">
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={this.handleClickNuevo}            
              >
                <ControlPoint />
              </Button>
            </Row>
          </Col>      
        </Row> 
      </Grid>
      <Modal isOpen={this.state.modalNuevoOpen}>
        <ModalHeader>
          AGREGAR TUTORIAL
        </ModalHeader>
        <ModalBody>

        </ModalBody>
        <ModalFooter>
          <Button onClick={this.mostrarModalNuevo}>Guardar</Button>
        </ModalFooter>
      </Modal>
    </>;
  }
}

export default App;
