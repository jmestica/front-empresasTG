import React from "react"
import "./Empresa.css"
import { useParams } from "react-router-dom"
import { Tag, IconButton, Nav, Button, Stack, Table, Modal, SelectPicker, Form, Input, InputGroup } from "rsuite"
const { Column, HeaderCell, Cell } = Table
import { SiMicrosoftoutlook, SiWhatsapp } from "react-icons/si"
import { FaPeopleArrows } from "react-icons/fa"
import { ImOnedrive } from "react-icons/im"
import { useState } from "react"

// ========================================== SELECT PICKER DATOS ========================================

const programasSelect = ['Kaizen Tango', 'PRODEPRO AT', 'PRODEPRO ANR', 'PAC', 'PRODUCTIVIDAD 4.0'].map(
  item => ({ label: item, value: item })
)

const estados = ['Potencial', 'En Proceso', 'Presentó', 'Aprobado', 'En curso', 'Finalizado'].map(
  item => ({ label: item, value: item })
)

const añosSelect = ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'].map(
  item => ({ label: item, value: item })
)

// ========================================== SUBCOMPONENTES ========================================

// eslint-disable-next-line react/prop-types
const Navbar = ({ active, onSelect, ...props }) => {
  return (
    <Nav
      {...props}
      activeKey={active}
      onSelect={onSelect}
      style={{ marginBottom: 50 }}
    >
      <Nav.Item eventKey="informacion-general">Información general</Nav.Item>
      <Nav.Item eventKey="antecedentes">Antecedentes</Nav.Item>
    </Nav>
  )
}

// eslint-disable-next-line react/display-name
const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);

// ############################################## MAIN ##############################################

function Empresa() {
  const { id } = useParams();
  const [active, setActive] = useState("informacion-general");

  // =========================== TAGS, HERRAMIENTAS Y ANTECEDENTES ==============================
  const [herramientas, setHerramientas] = useState(['5S', 'PDCA'])
  
  const [programas, setProgramas] = useState(['PRODEPRO', 'Productividad 4.0', 'Kaizen Tango'])
  
  const [antecedentes, setAntecedentes] = useState([
    { programa: "PRODEPRO AT", año: "2020", estado: "Finalizado" },
    { programa: "Productividad 4.0", año: "2021", estado: "Finalizado" },
    { programa: "Kaizen Tango", año: "2022", estado: "Finalizado" },
    { programa: "PRODEPRO AT", año: "2023", estado: "Presentó" },
  ])

  // ===================================== MODAL DETALLE ANTECEDENTE =================================================

  const [detalleAntecedentes, setDetalleAntecedente] = useState(null)

  const [openDetalle, setOpenDetalle] = useState(false)

  const handleOpenDetalle = (rowData) => {
  
    console.log(id)
    console.log(rowData)

    setDetalleAntecedente({nombre_empresa:  id, año: rowData.año, estado: rowData.estado, programa: rowData.programa});
    
    // const fetchDetalleAntecedente = fetch(...)
    setOpenDetalle(true)
  }
  const handleCloseDetalle = () => setOpenDetalle(false);


  const [detalleReadOnly, setDetalleReadOnly] = useState(true)




  // ============================= MODAL AGREGAR ANTECEDENTE =====================================

  const [openNuevoAntecedente, setOpenNuevoAntecedente] = useState(false)

  const handleOpenNuevoAntecedente = () => setOpenNuevoAntecedente(true)
  const handleCloseNuevoAntecedente = () => setOpenNuevoAntecedente(false);

  const handleSubmitNuevoAntecedente = () => {
    console.log('SUBMIT NUEVO ANTECEDENTE')
  }


  // ============================================================================================


  return (
    <div className="empresa-container">
      <div className="section-title">{id}</div>

      <div className="tabs">
        <Navbar active={active} onSelect={setActive} />
      </div>

      {/* =============================== PESTAÑA: INFORMACIÓN GENERAL ========================= */}

      {active === "informacion-general" && (
        <div className="general-data">
          {/* ================================================ RESUMEN ================================================= */}

          <div className="summ-container">
            <p className="header">RESUMEN</p>
            <p className="summ-content">
              Matra SRL es una empresa joven y dinámica , con alta experiencia
              en capital humano y con un sólido compromiso en la calidad de sus
              trabajos y servicios , con un mercado de actuación en la industria
              petrolera y minera.
            </p>
          </div>

          {/* ================================================ INFORMACIÓN GENERAL ================================================= */}

          <div className="general-info">
            <div className="inf-container">
              <div className="inf">
                <p className="header">CUIT</p>
                <p className="inf-content"> 3030939930</p>
              </div>

              <div className="inf">
                <p className="header">SECTOR</p>
                <p className="inf-content"> Hidrocarburos</p>
              </div>

              <div className="inf">
                <p className="header">PÁGINA WEB</p>
                <p className="inf-content">
                  {" "}
                  <a
                    href="https://www.matrasrl.com.ar/"
                    target="_blank"
                    rel="noreferrer "
                  >
                    {" "}
                    https://www.matrasrl.com.ar/
                  </a>{" "}
                </p>
              </div>
            </div>

            <div className="inf-container">
              <div className="inf">
                <p className="header">DOMICILIO</p>
                <p className="inf-content"> Antartida Argentina 164</p>
              </div>

              <div className="inf">
                <p className="header">LOCALIDAD</p>
                <p className="inf-content"> Plottier</p>
              </div>

              <div className="inf">
                <p className="header">TAMAÑO DE EMPRESA (SEPYME)</p>
                <p className="inf-content"> Pequeña </p>
              </div>
            </div>

            {/* ================================================ LINKS INTEGRACIONES ================================================= */}

            <div className="integrations-container">

                <IconButton
                  className="btn-icon"
                  icon={<ImOnedrive className="icon-button" />}
                  color="blue"
                  appearance="primary"
                  href="https://intigobar.sharepoint.com/:f:/s/-SORPAT-ATGsPatagnicos/EpF4X-oNeYdGmevnRrfVpRcBp7Lc4lqUuNaOkMO4frtyTA"
                  target="_blank"
                  noreferrer
                >
                  Carpeta ATGs Patagónicos
                </IconButton>
             
                <IconButton
                  className="btn-icon"
                  icon={<FaPeopleArrows className="icon-button" />}
                  color="red"
                  appearance="primary"
                  href="https://crm.inti.gob.ar/index.php?module=Accounts&offset=1&stamp=1688171761027743400&return_module=Accounts&action=DetailView&record=c604163c-0c14-d21b-b6c7-61c223215a42"
                  target="_blank"
                  rel="noreferrer">
                  Historial CRM
                </IconButton>
              </div>
          </div>

          {/* ================================================ CARDS DE CONTACTO ================================================= */}

          <div className="contact-info">
            <p className="header-2">INFORMACIÓN DE CONTACTO</p>

            <Stack wrap spacing={6}>
              <div className="contact-card">
                <Tag color="blue" className="tag">
                  Contacto 1
                </Tag>

                <div className="line">
                  <p className="header">NOMBRE:</p>{" "}
                  <p className="contact-content">Administración</p>{" "}
                </div>
                <div className="line">
                  <p className="header">WHATSAPP:</p>{" "}
                  <p className="contact-content">+54 299 6337902</p>{" "}
                </div>
                <div className="line">
                  <p className="header">MAIL:</p>{" "}
                  <p className="contact-content">
                    {" "}
                    administracion@matrasrl.com.ar
                  </p>{" "}
                </div>

                <div className="btn-bar">
                  <Button
                    className="contact-btn"
                    color="blue"
                    appearance="primary"
                    endIcon={<SiMicrosoftoutlook />}
                  >
                    Contactar por Mail
                  </Button>

                  <Button
                    className="contact-btn"
                    color="green"
                    appearance="primary"
                    endIcon={<SiWhatsapp />}
                  >
                    Contactar por WhatsApp
                  </Button>
                </div>
              </div>
              <div className="contact-card">
                <Tag color="blue" className="tag">
                  Contacto 2
                </Tag>

                <div className="line">
                  <p className="header">NOMBRE:</p>{" "}
                  <p className="contact-content">Administración</p>{" "}
                </div>
                <div className="line">
                  <p className="header">WHATSAPP:</p>{" "}
                  <p className="contact-content">+54 299 6337902</p>{" "}
                </div>
                <div className="line">
                  <p className="header">MAIL:</p>{" "}
                  <p className="contact-content">
                    {" "}
                    administracion@matrasrl.com.ar
                  </p>{" "}
                </div>

                <div className="btn-bar">
                  <Button
                    className="contact-btn"
                    color="blue"
                    appearance="primary"
                    endIcon={<SiMicrosoftoutlook />}
                  >
                    Contactar por Mail
                  </Button>

                  <Button
                    className="contact-btn"
                    color="green"
                    appearance="primary"
                    endIcon={<SiWhatsapp />}
                  >
                    Contactar por WhatsApp
                  </Button>
                </div>
              </div>
              <div className="contact-card">
                <Tag color="blue" className="tag">
                  Contacto 3
                </Tag>

                <div className="line">
                  <p className="header">NOMBRE:</p>{" "}
                  <p className="contact-content">Administración</p>{" "}
                </div>
                <div className="line">
                  <p className="header">WHATSAPP:</p>{" "}
                  <p className="contact-content">+54 299 6337902</p>{" "}
                </div>
                <div className="line">
                  <p className="header">MAIL:</p>{" "}
                  <p className="contact-content">
                    {" "}
                    administracion@matrasrl.com.ar
                  </p>{" "}
                </div>

                <div className="btn-bar">
                  <Button
                    className="contact-btn"
                    color="blue"
                    appearance="primary"
                    endIcon={<SiMicrosoftoutlook />}
                  >
                    Contactar por Mail
                  </Button>

                  <Button
                    className="contact-btn"
                    color="green"
                    appearance="primary"
                    endIcon={<SiWhatsapp />}
                  >
                    Contactar por WhatsApp
                  </Button>
                </div>
              </div>
            </Stack>
          </div>
        </div>
      )}

      {/* ================================================ PESTAÑA DE ANTECEDENTES ================================================= */}

      {active === "antecedentes" && (
        <div className="antecedentes">
    
          {/* ========================  HERRAMIENTAS  ============================= */}
          <p className="header-2">HERRAMIENTAS</p>
          <div className="tags-container">
            {herramientas.map((item)=> <Tag key={item} color="blue">{item}</Tag> )}
          </div>

        {/* ========================  PROGRAMAS  ============================= */}
          <p className="header-2">PROGRAMAS</p>

          <div className="tags-container">
            {programas.map((item) => <Tag key={item} color="red">{item}</Tag>)}
          </div>

          <br />
        {/* ========================  TABLA  ============================= */}
          <Table
            autoHeight
            data={antecedentes}
            onRowClick={(rowData) => {
              handleOpenDetalle(rowData);
            }}
          >
            <Column flexGrow={1} align="center" fixed>
              <HeaderCell>Programa</HeaderCell>
              <Cell dataKey="programa" />
            </Column>

            <Column width={60} align="center" fixed>
              <HeaderCell>Año</HeaderCell>
              <Cell dataKey="año" />
            </Column>

            <Column flexGrow={1} align="center" fixed>
              <HeaderCell>Estado</HeaderCell>
              <Cell dataKey="estado" />
            </Column>

          </Table>
          <br/>
          
          <Button block appearance="primary" color="blue" onClick={handleOpenNuevoAntecedente} >Agregar</Button>

          {/* ========================  MODAL AGREGAR ANTECEDENTE  ============================= */}

          <Modal open={openNuevoAntecedente} onClose={handleCloseNuevoAntecedente}>
            <Modal.Header>
              <Modal.Title className="header-2">AGREGAR ANTECEDENTE</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form fluid onSubmit={handleSubmitNuevoAntecedente}>
                  <Form.Group controlId="resumen">
                    <Form.ControlLabel>RESUMEN</Form.ControlLabel>
                    <Form.Control rows={5} name="textarea" accepter={Textarea} required />
                    <Form.HelpText>Breve descripción del contacto con la empresa</Form.HelpText>
                  </Form.Group>

                  <Form.Group controlId="programa">
                    <Form.ControlLabel>PROGRAMA</Form.ControlLabel>
                    <SelectPicker required data={programasSelect} searchable={false} placeholder="Seleccione un programa" block />
                  </Form.Group>

                  <Form.Group controlId="año">
                    <Form.ControlLabel>AÑO</Form.ControlLabel>
                    <SelectPicker required data={añosSelect} searchable={false} placeholder="Seleccione el año" block />
                  </Form.Group>

                  <Form.Group controlId="estado">
                    <Form.ControlLabel>ESTADO</Form.ControlLabel>
                    <SelectPicker required data={estados} searchable={false} placeholder="Seleccione el estado" block />
                  </Form.Group>
              
                  <Form.Group controlId="link">
                    <Form.ControlLabel>LINK CARPETA</Form.ControlLabel>
                    <Form.Control name="link" type="link" required/>
                    <Form.HelpText>Para obtener el link, desde la carpeta de ATGs seleccione "Copiar Vínculo" {">"} Click en: "Los usuarios de Instituto ..." {">"} Personas que tienen acceso {">"} Aplicar {">"} Copiar </Form.HelpText>
                  </Form.Group>

                  <Button onClick={handleSubmitNuevoAntecedente} appearance="primary" type="submit">
                      Guardar
                  </Button>
                  <Button onClick={handleCloseNuevoAntecedente} appearance="subtle">
                      Cancelar
                  </Button>
               

              </Form>

            </Modal.Body>

          </Modal>

          {/* ========================  MODAL DETALLE  ============================= */}

          <Modal open={openDetalle} onClose={handleCloseDetalle}>
            <Modal.Header>
              <Modal.Title className="header-2">DETALLE ANTECEDENTE</Modal.Title>
            </Modal.Header>

            
            <Modal.Body>
            <Form fluid>
               <Form.Group controlId="resumen">
                    <Form.ControlLabel>RESUMEN</Form.ControlLabel>
                    <Form.Control rows={4} name="textarea"  readOnly accepter={Textarea} required value="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minima vero, reprehenderit temporibus libero harum, soluta ullam rerum architecto, fugit sapiente quas qui cumque voluptate optio tempora quo iusto in facere?"/>
                </Form.Group>

                <Form.Group controlId="programa">
                    <Form.ControlLabel>PROGRAMA</Form.ControlLabel>
                    <Form.Control name="programa" readOnly value={detalleAntecedentes && detalleAntecedentes.programa ? detalleAntecedentes.programa : 'Sin programa disponible'}/>
                </Form.Group>

                <Form.Group controlId="año">
                    <Form.ControlLabel>AÑO</Form.ControlLabel>
                    <Form.Control readOnly value={detalleAntecedentes && detalleAntecedentes.año ? detalleAntecedentes.año : 'Sin año disponible'}/>
                </Form.Group>

                <Form.Group controlId="estado">
                    <Form.ControlLabel>ESTADO</Form.ControlLabel> 
                    {detalleAntecedentes && <SelectPicker block readOnly={detalleAntecedentes && detalleAntecedentes.estado === 'Finalizado'? true : false} data={estados} searchable={false} defaultValue={detalleAntecedentes &&detalleAntecedentes.estado} placeholder={detalleAntecedentes.estado} disabledItemValues={[detalleAntecedentes.estado]}/>} 
                </Form.Group>

                <Form.Group controlId="link_carpeta_antecedente">
                    <Form.ControlLabel>CARPETA DOCUMENTACIÓN</Form.ControlLabel>

                    <Button
                    className="contact-btn"
                    color="blue"
                    appearance="primary"
                    endIcon={<ImOnedrive/>}
                    href="https://intigobar.sharepoint.com/:f:/r/sites/-SORPAT-ATGsPatagnicos/Documentos%20compartidos/ATGs%20Patag%C3%B3nicos/01.%20Empresas,%20Org,%20Coope/C-MATRA/2020-PRODEPRO?csf=1&web=1&e=vSLRGq"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Carpeta de Documentación
                  </Button>
                </Form.Group>

              <Button onClick={handleCloseDetalle} appearance="primary" block>
                Aceptar
              </Button>
              <Button appearance="primary" color="orange" block>
                Editar
              </Button>
              <Button onClick={handleCloseDetalle} appearance="primary" block color="red">
                Cancelar
              </Button>

                
            </Form>
            
          </Modal.Body>


          
          
          </Modal>


        </div>
      )}
    </div>
  );
}

export default Empresa;
