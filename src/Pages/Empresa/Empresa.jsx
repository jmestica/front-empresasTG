import React from "react";
import "./Empresa.css";
import { useParams } from "react-router-dom";
import {
  Tag,
  IconButton,
  Nav,
  Button,
  Stack,
  Table,
  Modal,
  SelectPicker,
  Form,
  Input,
  InputGroup,
  Panel,
  PanelGroup,
} from "rsuite";
const { Column, HeaderCell, Cell } = Table;
import { SiMicrosoftoutlook, SiWhatsapp } from "react-icons/si";
import { FaPeopleArrows } from "react-icons/fa";
import { useState, useEffect, forwardRef } from "react";

import axios from "axios";
import API_BASE_URL from "../../config";

// ========================================== SELECT PICKER DATOS ========================================

const programasSelect = [
  "Kaizen Tango",
  "PRODEPRO AT",
  "PRODEPRO ANR",
  "PAC",
  "PRODUCTIVIDAD 4.0",
].map((item) => ({ label: item, value: item }));

const estados = [
  "Potencial",
  "En Proceso",
  "Presentó",
  "Aprobado",
  "En curso",
  "Finalizado",
].map((item) => ({ label: item, value: item }));

const añosSelect = [
  "2017",
  "2018",
  "2019",
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
].map((item) => ({ label: item, value: item }));

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
  );
};

// eslint-disable-next-line react/display-name
const Textarea = forwardRef((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));

// ############################################## MAIN ##############################################

function Empresa() {
  const { id } = useParams();
  const [active, setActive] = useState("informacion-general");

  // =========================== TAGS, HERRAMIENTAS, CONTACTOS Y ANTECEDENTES ==============================
  const [herramientas, setHerramientas] = useState([]);

  const programasSelect = [
    "Kaizen Tango",
    "PRODEPRO AT",
    "PRODEPRO ANR",
    "PAC",
    "PRODUCTIVIDAD 4.0",
    "AT Sin Financiamiento",
    "Programa PAE",
    "Otro",
  ].map((item) => ({ label: item, value: item }));

  const [datosEmpresa, setDatosEmpresa] = useState([]);
  const [antecedentes, setAntecedentes] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [cadena, setCadena] = useState([]);
  const [claes, setClaes] = useState([]);

  // ===================================== MODAL DETALLE ANTECEDENTE =================================================

  const [detalleAntecedentes, setDetalleAntecedente] = useState(null);

  const [openDetalle, setOpenDetalle] = useState(false);

  const handleOpenDetalle = (rowData) => {
    setDetalleAntecedente({
      nombre_empresa: id,
      año: rowData.año,
      estado: rowData.estado,
      programa: rowData.programa,
    });

    // const fetchDetalleAntecedente = fetch(...)
    setOpenDetalle(true);
  };
  const handleCloseDetalle = () => setOpenDetalle(false);

  const [detalleReadOnly, setDetalleReadOnly] = useState(true);

  // ============================= MODAL AGREGAR ANTECEDENTE =====================================

  const [openNuevoAntecedente, setOpenNuevoAntecedente] = useState(false);

  const handleOpenNuevoAntecedente = () => setOpenNuevoAntecedente(true);
  const handleCloseNuevoAntecedente = () => setOpenNuevoAntecedente(false);

  const handleSubmitNuevoAntecedente = () => {
    console.log("SUBMIT NUEVO ANTECEDENTE");
  };

  // ============================================================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response_empresa = await axios.get(
          `${API_BASE_URL}/empresas/${id}`
        );

        setDatosEmpresa(response_empresa.data);

        const cadena_valor = await axios.get(
          `${API_BASE_URL}/empresas/cadena/${id}`
        );

        setCadena(cadena_valor.data);

        const response_claes = await axios.get(
          `${API_BASE_URL}/clae/clae_empresa/${id}`
        );

        setClaes(response_claes.data);

        const response_contactos = await axios.get(
          `${API_BASE_URL}/empresas/contactos/${id}`
        );

        console.log(response_contactos.data);
        setContactos(response_contactos.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="empresa-container">
      <div className="section-title">{datosEmpresa.razon_social}</div>

      <div className="tabs">
        <Navbar active={active} onSelect={setActive} />
      </div>

      {/* =============================== PESTAÑA: INFORMACIÓN GENERAL ========================= */}

      {active === "informacion-general" && (
        <div className="general-data">
          {/* ================================================ RESUMEN ================================================= */}

          <div className="summ-container">
            <p className="header">DESCRIPCIÓN</p>
            <p className="summ-content">{datosEmpresa.descripcion}</p>
          </div>

          {/* ================================================ INFORMACIÓN GENERAL ================================================= */}

          <div className="general-info">
            <div className="inf-container">
              <div className="inf">
                <p className="header" style={{ textAlign: "center" }}>
                  CUIT
                </p>
                <p className="inf-content"> {datosEmpresa.cuit}</p>
              </div>

              <div className="inf">
                <p className="header" style={{ textAlign: "center" }}>
                  SECTOR DE PERTENENCIA
                </p>
                <Tag color="violet" style={{ textAlign: "center" }}>
                  {datosEmpresa.sector_pertenece}
                </Tag>
              </div>

              <div className="inf">
                <p className="header" style={{ textAlign: "center" }}>
                  SECTORES QUE ABASTECE
                </p>

                <div className="tags-container" style={{ display: "flex" }}>
                  {cadena.map((sector) => (
                    <Tag color="orange">{sector.nombre_sector}</Tag>
                  ))}
                </div>
              </div>
            </div>

            <div className="inf-container">
              <div className="inf">
                <p className="header">PÁGINA WEB</p>
                <p className="inf-content">
                  <a
                    href={datosEmpresa.link_web}
                    target="_blank"
                    rel="noreferrer "
                  >
                    {datosEmpresa.link_web}
                  </a>
                </p>
              </div>

              <div className="inf">
                <p className="header">DOMICILIO</p>
                <p className="inf-content"> {datosEmpresa.domicilio}</p>
              </div>

              <div className="inf">
                <p className="header">LOCALIDAD</p>
                <p className="inf-content"> {datosEmpresa.ciudad}</p>
              </div>

              <div className="inf">
                <p className="header">PROVINCIA</p>
                <p className="inf-content"> {datosEmpresa.provincia}</p>
              </div>
            </div>

            <div
              className="inf-container"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className="inf">
                <p className="header">TAMAÑO DE EMPRESA (SEPYME)</p>
                <p className="inf-content" style={{ textAlign: "center" }}>
                  {" "}
                  {datosEmpresa.tamaño_sepyme}{" "}
                </p>
              </div>
            </div>
            <div className="inf-container">
              <div className="inf">
                <p className="header" style={{ textAlign: "center" }}>
                  CLAES
                </p>
                {claes.map((clae) => (
                  <p>
                    {" "}
                    {clae.codigo_clae} - {clae.seccion_clae} -{" "}
                    {clae.descripcion_actividad}
                  </p>
                ))}
              </div>
            </div>

            {/* ================================================ LINKS INTEGRACIONES ================================================= */}

            <div className="integrations-container">
              <IconButton
                className="btn-icon"
                icon={<FaPeopleArrows className="icon-button" />}
                color="red"
                appearance="primary"
                href={datosEmpresa.link_crm}
                target="_blank"
                rel="noreferrer"
              >
                Historial CRM
              </IconButton>
            </div>
          </div>

          {/* ================================================ CARDS DE CONTACTO ================================================= */}

          <div className="contact-info">
            <p className="header-2">INFORMACIÓN DE CONTACTO</p>
            <PanelGroup accordion bordered style={{margin: '50px 20px'}}>
              {contactos.map((contacto, index) => {
                return (
                  <Panel header={`${contacto.nombre_contacto}`} eventKey={index} id={`panel${1}`}>
                      <p className="header">PUESTO</p>
                      <p>{contacto.puesto}</p>
                      <br />
                      <p className="header">EMAIL</p>
                      <p>{contacto.email}</p>
                      <br />
                      <p className="header">TELÉFONO</p>
                      <p>{contacto.telefono}</p>

                  </Panel>
                );
              })}
            </PanelGroup>
          </div>
        </div>
      )}

      {/* ================================================ PESTAÑA DE ANTECEDENTES ================================================= */}

      {active === "antecedentes" && (
        <div className="antecedentes">
          {/* ========================  HERRAMIENTAS  ============================= */}
          <p className="header-2">HERRAMIENTAS</p>
          <div className="tags-container">
            {herramientas.map((item) => (
              <Tag key={item} color="blue">
                {item}
              </Tag>
            ))}
          </div>

          {/* ========================  PROGRAMAS  ============================= */}
          <p className="header-2">PROGRAMAS</p>

          <div className="tags-container">
            {programas.map((item) => (
              <Tag key={item} color="red">
                {item}
              </Tag>
            ))}
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
              <Cell dataKey="motivo" />
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
          <br />

          <Button
            block
            appearance="primary"
            color="blue"
            onClick={handleOpenNuevoAntecedente}
          >
            Agregar
          </Button>

          {/* ========================  MODAL AGREGAR ANTECEDENTE  ============================= */}

          <Modal
            open={openNuevoAntecedente}
            onClose={handleCloseNuevoAntecedente}
          >
            <Modal.Header>
              <Modal.Title className="header-2">
                AGREGAR ANTECEDENTE
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form fluid onSubmit={handleSubmitNuevoAntecedente}>
                <Form.Group controlId="resumen">
                  <Form.ControlLabel>RESUMEN</Form.ControlLabel>
                  <Form.Control
                    rows={5}
                    name="textarea"
                    accepter={Textarea}
                    required
                  />
                  <Form.HelpText>
                    Breve descripción del contacto con la empresa
                  </Form.HelpText>
                </Form.Group>

                <Form.Group controlId="programa">
                  <Form.ControlLabel>PROGRAMA</Form.ControlLabel>
                  <SelectPicker
                    required
                    data={programasSelect}
                    searchable={false}
                    placeholder="Seleccione un programa"
                    block
                  />
                </Form.Group>

                <Form.Group controlId="año">
                  <Form.ControlLabel>AÑO</Form.ControlLabel>
                  <SelectPicker
                    required
                    data={añosSelect}
                    searchable={false}
                    placeholder="Seleccione el año"
                    block
                  />
                </Form.Group>

                <Form.Group controlId="estado">
                  <Form.ControlLabel>ESTADO</Form.ControlLabel>
                  <SelectPicker
                    required
                    data={estados}
                    searchable={false}
                    placeholder="Seleccione el estado"
                    block
                  />
                </Form.Group>

                <Button
                  onClick={handleSubmitNuevoAntecedente}
                  appearance="primary"
                  type="submit"
                >
                  Guardar
                </Button>
                <Button
                  onClick={handleCloseNuevoAntecedente}
                  appearance="subtle"
                >
                  Cancelar
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          {/* ========================  MODAL DETALLE  ============================= */}

          <Modal open={openDetalle} onClose={handleCloseDetalle}>
            <Modal.Header>
              <Modal.Title className="header-2">
                DETALLE ANTECEDENTE
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form fluid>
                <Form.Group controlId="resumen">
                  <Form.ControlLabel>RESUMEN</Form.ControlLabel>
                  <Form.Control
                    rows={4}
                    name="textarea"
                    readOnly
                    accepter={Textarea}
                    required
                    value="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minima vero, reprehenderit temporibus libero harum, soluta ullam rerum architecto, fugit sapiente quas qui cumque voluptate optio tempora quo iusto in facere?"
                  />
                </Form.Group>

                <Form.Group controlId="programa">
                  <Form.ControlLabel>PROGRAMA</Form.ControlLabel>
                  <Form.Control
                    name="programa"
                    readOnly
                    value={
                      detalleAntecedentes && detalleAntecedentes.programa
                        ? detalleAntecedentes.programa
                        : "Sin programa disponible"
                    }
                  />
                </Form.Group>

                <Form.Group controlId="año">
                  <Form.ControlLabel>AÑO</Form.ControlLabel>
                  <Form.Control
                    readOnly
                    value={
                      detalleAntecedentes && detalleAntecedentes.año
                        ? detalleAntecedentes.año
                        : "Sin año disponible"
                    }
                  />
                </Form.Group>

                <Form.Group controlId="estado">
                  <Form.ControlLabel>ESTADO</Form.ControlLabel>
                  {detalleAntecedentes && (
                    <SelectPicker
                      block
                      readOnly={
                        detalleAntecedentes &&
                        detalleAntecedentes.estado === "Finalizado"
                          ? true
                          : false
                      }
                      data={estados}
                      searchable={false}
                      defaultValue={
                        detalleAntecedentes && detalleAntecedentes.estado
                      }
                      placeholder={detalleAntecedentes.estado}
                      disabledItemValues={[detalleAntecedentes.estado]}
                    />
                  )}
                </Form.Group>

                <Button onClick={handleCloseDetalle} appearance="primary" block>
                  Aceptar
                </Button>
                <Button appearance="primary" color="orange" block>
                  Editar
                </Button>
                <Button
                  onClick={handleCloseDetalle}
                  appearance="primary"
                  block
                  color="red"
                >
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
