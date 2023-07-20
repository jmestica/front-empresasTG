import { useState, forwardRef, useEffect } from "react";
import {
  Steps,
  Panel,
  ButtonGroup,
  Button,
  Form,
  Input,
  SelectPicker,
  InputGroup,
  Table,
  Modal,
  TagPicker,
  AutoComplete,
  Notification,
  IconButton,
  useToaster,
  PanelGroup,
  Message,
} from "rsuite";

import SearchIcon from "@rsuite/icons/Search";
import CloseIcon from "@rsuite/icons/Close";

const { Column, HeaderCell, Cell } = Table;

import axios from "axios";
import API_BASE_URL from "../../config";

import "./agregar.css";
import { useSearch } from "rsuite/esm/Picker";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/display-name
const Textarea = forwardRef((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));

//==================================== SELECT PICKER DATA ============================
const tamaños_select = [
  "Micro",
  "Pequeña",
  "Mediana - Tramo 1",
  "Mediana - Tramo 2",
  "No conocido",
].map((item) => ({ label: item, value: item }));

const provincias_select = [
  "Neuquén",
  "Río Negro",
  "Chubut",
  "Santa Cruz",
  "Tierra del Fuego",
].map((item) => ({ label: item, value: item }));

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

const estados = [
  "Potencial",
  "En Proceso",
  "Presentó",
  "Aprobado",
  "En curso",
  "Finalizado",
  "No avanzó",
].map((item) => ({ label: item, value: item }));

const añosSelect = ["2023", "2022", "2021", "2020", "2019"];

//============================================================================

function Agregar() {
  //================================== STATES ===================================
  const navigate = useNavigate();

  //Formulario de pasos
  const [step, setStep] = useState(0);
  const [statusStep1, setStatusStep1] = useState("process");
  const [statusStep2, setStatusStep2] = useState("process");
  const [statusStep3, setStatusStep3] = useState("process");
  const [statusStep4, setStatusStep4] = useState("process");
  const [statusStep5, setStatusStep5] = useState("process");

  //Datos del formulario
  const [formData, setFormData] = useState({
    cuit1: "",
    cuit2: "",
    cuit3: "",
    tamaño_sepyme: "",
    razon_social: "",
    domicilio: "",
    descripcion: "",
    link_web: "",
    link_crm: "",
    provincia: "",
    ciudad: "",
    parque_industrial: "",
    antecedentes: [],
    sector_pertenece: "",
    sectores_provee: [],
    clae: [],
    contactos: [],
  });

  //Modal y notificación
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [type, setType] = useState("error");
  const [header, setHeader] = useState("");
  const [message, setMessage] = useState("");
  const toaster = useToaster();

  //Datos de localización
  const [ciudades, setCiudades] = useState([]);
  const [ciudadesBusqueda, setCiudadesBusqueda] = useState([]);
  const [parques, setParques] = useState([]);
  const [ciudadesDisabled, setCiudadesDisabled] = useState(true);
  const [parquesDisabled, setParquesDisabled] = useState(true);

  //Datos de antecedentes
  const [asesores, setAsesores] = useState([]);

  const [herramientas, setHerramientas] = useState([]);
  const [sectores, setSectores] = useState();
  const [claesEmpresa, setClaesEmpresa] = useState([]);

  const [antecedenteEditable, setAntecedenteEditable] = useState({});

  // ============================ NOTIFICACIÓN =======================

  const notificacion = (
    <Notification
      type={type}
      header={header}
      style={{ marginLeft: "320px" }}
      closable
    >
      <p>{message}</p>
    </Notification>
  );

  //====================== STEPS HANDLER =============================

  const onChange = (nextStep) => {
    setStep(nextStep < 0 ? 0 : nextStep > 4 ? 4 : nextStep);

    //Advertencias del primer formulario
    if (nextStep === 0) {
      setStatusStep1("process");
    }

    //Advertencias de error primer formulario
    else if (nextStep === 1) {
      setStatusStep2("process");
      if (
        !formData.cuit2 ||
        !formData.cuit3 ||
        !formData.domicilio ||
        !formData.descripcion
      ) {
        setStatusStep1("error");
      } else {
        setStatusStep1("finish");
      }
    }

    //Advertencias de segundo formulario
    else if (nextStep === 2) {
      setStatusStep3("process");

      if (
        !formData.provincia ||
        !formData.ciudad ||
        !formData.parque_industrial
      ) {
        setStatusStep2("error");
      } else {
        setStatusStep2("finish");
      }
    }

    //Como una empresa puede ser cargada sin antecedentes, no se marca errores en el paso 3
    else if (nextStep === 3) {
      setStatusStep3("finish");
      setStatusStep4("process");
    } else if (nextStep === 4) {
      if (!formData.sector_pertenece || !formData.sectores_provee.length > 0) {
        setStatusStep4("error");
      } else {
        setStatusStep4("finish");
      }
    }
  };

  const onNext = () => onChange(step + 1);
  const onPrevious = () => onChange(step - 1);

  //================================  HANDLERS ====================================

  const handleProvinciaSelect = async (value) => {
    let nombres_ciudades = [];

    setFormData({ ...formData, provincia: value });

    const response = await axios.get(`${API_BASE_URL}/ciudades/${value}`);

    response.data.map((ciudad) => {
      nombres_ciudades.push(ciudad.nombre_ciudad);
    });

    nombres_ciudades = nombres_ciudades.map((item) => ({
      label: item,
      value: item,
    }));

    setCiudades(nombres_ciudades);
    setCiudadesDisabled(false);
  };

  const handleCiudadSelect = async (value) => {
    let nombre_parques = [];

    setFormData({ ...formData, ciudad: value });

    const response = await axios.get(`${API_BASE_URL}/parques/${value}`);

    response.data.map((parque) => {
      nombre_parques.push(parque.nombre_parque);
    });

    nombre_parques = nombre_parques.map((item) => ({
      label: item,
      value: item,
    }));

    nombre_parques.push({
      label: "No pertenece a parque",
      value: "No pertenece a parque",
    });

    setParques(nombre_parques);

    setParquesDisabled(false);
  };

  const busquedaCiudades = async (value) => {
    if (value.length >= 3) {
      let ciudades_buscadas = [];
      const busqueda = await axios.get(
        `${API_BASE_URL}/ciudades/search/${value}`
      );

      busqueda.data.map((ciudad) => {
        ciudades_buscadas.push(ciudad.nombre_ciudad);
      });

      ciudades_buscadas = ciudades_buscadas.map((item) => ({
        label: item,
        value: item,
      }));

      setCiudadesBusqueda(ciudades_buscadas);
    }
  };

  const handleSubmitAgregarAntecedente = (e, e2) => {
    //Generación de objetos
    const herramientas = e2.target.herramientas.defaultValue.split(",");
    const asesores = e2.target.asesores.defaultValue.split(",");

    const nuevo_antecedente = {
      resumen: e2.target.resumen.value,
      motivo: e2.target.programa.defaultValue,
      año: e2.target.año.defaultValue,
      estado: e2.target.estado.defaultValue,
      herramientas: herramientas,
      ciudad: e2.target.ciudad.defaultValue,
      asesores: asesores,
    };

    //Validación de campos obligatorios
    if (
      nuevo_antecedente.resumen &&
      nuevo_antecedente.motivo &&
      nuevo_antecedente.año &&
      nuevo_antecedente.estado
    ) {
      setFormData({
        ...formData,
        antecedentes: [...formData.antecedentes, nuevo_antecedente],
      });

      handleCloseAdd();
    } else {
      setMessage("Hay campos obligatorios incompletos");
      setType("error");
      setHeader("Campos obligatorios");
      toaster.push(notificacion);
    }
  };

  function sonArraysIguales(array1, array2) {
    if (array1.length !== array2.length) {
      return false;
    }

    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }

    return true;
  }

  const esDiferente = (obj) => {
    return (
      obj.resumen !== antecedenteEditable.resumen ||
      obj.motivo !== antecedenteEditable.motivo ||
      obj.año !== antecedenteEditable.año ||
      obj.estado !== antecedenteEditable.estado ||
      obj.ciudad !== antecedenteEditable.ciudad ||
      !sonArraysIguales(obj.herramientas, antecedenteEditable.herramientas) ||
      !sonArraysIguales(obj.asesores, antecedenteEditable.asesores)
    );
  };

  const handleSubmitEditarAntecedente = (e, e2) => {
    //Generación de objetos
    const herramientas = e2.target.herramientas.defaultValue.split(",");
    const asesores = e2.target.asesores.defaultValue.split(",");

    const nuevo_antecedente = {
      resumen: e2.target.resumen.value,
      motivo: e2.target.programa.defaultValue,
      año: e2.target.año.defaultValue,
      estado: e2.target.estado.defaultValue,
      herramientas: herramientas,
      ciudad: e2.target.ciudad.defaultValue,
      asesores: asesores,
    };

    //Validación de campos obligatorios
    if (
      nuevo_antecedente.resumen &&
      nuevo_antecedente.motivo &&
      nuevo_antecedente.año &&
      nuevo_antecedente.estado
    ) {
      if (esDiferente(nuevo_antecedente)) {
        let antecedenteUpdate = formData.antecedentes;

        antecedenteUpdate = antecedenteUpdate.filter(
          (obj) =>
            obj.motivo !== nuevo_antecedente.motivo ||
            obj.año !== nuevo_antecedente.año
        );

        antecedenteUpdate.push(nuevo_antecedente);

        setFormData({
          ...formData,
          antecedentes: antecedenteUpdate,
        });

        handleCloseEdit();
      } else {
        handleCloseEdit();
      }
    } else {
      setMessage("Hay campos obligatorios incompletos");
      setType("error");
      setHeader("Campos obligatorios");
      toaster.push(notificacion);
    }
  };

  const borrarAntecedente = (rowData) => {
    const actual = formData.antecedentes;

    const antecedentesUpdate = actual.filter((item) => {
      return (
        item.motivo !== rowData.motivo ||
        item.año !== rowData.año ||
        item.estado !== rowData.estado
      );
    });

    setFormData({ ...formData, antecedentes: antecedentesUpdate });
  };

  const editarAntecedente = (rowData) => {
    setAntecedenteEditable({
      resumen: rowData.resumen,
      motivo: rowData.motivo,
      año: rowData.año,
      estado: rowData.estado,
      herramientas: rowData.herramientas,
      ciudad: rowData.ciudad,
      asesores: rowData.asesores,
    });

    handleOpenEdit();
  };

  const handleOpenEdit = () => {
    setOpenEdit(true);
  };

  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleSubmitAgregarContacto = (e, e2) => {
    const nuevo_contacto = {
      nombre: e2.target.nombre_contacto.value,
      puesto: e2.target.puesto_contacto.value,
      telefono: e2.target.telefono.value,
      email: e2.target.email.value,
    };

    if (
      (!nuevo_contacto.telefono && !nuevo_contacto.email) ||
      !nuevo_contacto.nombre
    ) {
      setMessage(
        "Hay campos obligatorios incompletos, verifique que haya completado el nombre, mail o teléfono del contacto."
      );
      setType("error");
      setHeader("Campos obligatorios");
      toaster.push(notificacion);
    } else {
      const existeContacto = formData.contactos.some((contacto) => {
        return (
          contacto.nombre === nuevo_contacto.nombre ||
          (contacto.email === nuevo_contacto.email &&
            contacto.telefono === nuevo_contacto.telefono)
        );
      });

      if (!existeContacto) {
        setFormData({
          ...formData,
          contactos: [...formData.contactos, nuevo_contacto],
        });

        e2.target.reset();
      } else {
        setMessage("El contacto ya está registrado");
        setType("error");
        setHeader("Contacto ya existente");
        toaster.push(notificacion);
      }
    }
  };

  const handleDeleteContacto = (index) => {
    let contactosUpdate = formData.contactos;
    contactosUpdate.splice(index, 1);

    setFormData({ ...formData, contactos: contactosUpdate });
  };

  const obtenerClae = async (e) => {
    const codigo = e.target.value;

    if (!isNaN(parseFloat(codigo)) && isFinite(codigo)) {
      const descripcion_clae = await axios.get(
        `${API_BASE_URL}/clae/${codigo}`
      );

      if (descripcion_clae.data.length === 1) {
        if (!formData.clae.includes(codigo)) {
          setFormData({ ...formData, clae: [...formData.clae, codigo] });

          setClaesEmpresa([...claesEmpresa, descripcion_clae.data[0]]);
        }
      } else {
        setType("error");
        setHeader("No encontrado");
        setMessage("El código ingresado no existe");

        toaster.push(notificacion);
      }
    }

    e.target.value = "";
  };

  const borrarClae = (clae) => {
    //Borrado del formulario
    let claeUpdate = formData.clae;

    const index = claeUpdate.indexOf(clae);

    if (index > -1) {
      claeUpdate.splice(index, 1);
    }

    setFormData({ ...formData, clae: claeUpdate });

    //Borrado de claes encontrados

    let claesEncontradosUpdate = claesEmpresa;

    claesEncontradosUpdate = claesEncontradosUpdate.filter(
      (item) => clae !== item.codigo_clae
    );

    setClaesEmpresa(claesEncontradosUpdate);
  };

  const cargarEmpresa = async () => {
    const response = await axios.post(`${API_BASE_URL}/empresas`, formData);

    if (response.data.rowCount === 1) {
      const success = (
        <Message
          id="finalsuccess"
          showIcon
          type="success"
          style={{
            position: "fixed",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            minHeight: "100vh",
            transform: "translateY(-50px)",
          }}
        >
          <h1>La empresa se cargó correctamente</h1>
        </Message>
      );

      toaster.push(success, { duration: 1500 });

    }
  };

  // ==================================== COMPONENTE =======================================

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        //===============================FETCH DATOS=============================
        let fetchSectores = [];
        let fetchHerramientas = [];
        let fetchAsesores = [];

        //Sectores
        const response_sectores = await axios.get(`${API_BASE_URL}/sectores`);

        response_sectores.data.map((sector) => {
          fetchSectores.push(sector.nombre_sector);
        });

        fetchSectores = fetchSectores.map((item) => ({
          label: item,
          value: item,
        }));

        setSectores(fetchSectores);

        //Herramientas
        const response_herramientas = await axios.get(
          `${API_BASE_URL}/herramientas`
        );

        response_herramientas.data.map((herramienta) => {
          fetchHerramientas.push(herramienta.nombre_herramienta);
        });

        fetchHerramientas = fetchHerramientas.map((item) => ({
          label: item,
          value: item,
        }));

        setHerramientas(fetchHerramientas);

        //Asesores
        const response_asesores = await axios.get(`${API_BASE_URL}/asesores`);

        response_asesores.data.map((asesor) => {
          fetchAsesores.push(asesor.nombre_asesor);
        });

        fetchAsesores = fetchAsesores.map((item) => ({
          label: item,
          value: item,
        }));

        setAsesores(fetchAsesores);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDatos();
  }, []);

  //============================================================================================

  return (
    <div>
      <div className="section-title">AGREGAR EMPRESA</div>

      <div className="step-container">
        <Steps current={step}>
          <Steps.Item title="Datos Generales" status={statusStep1} />
          <Steps.Item title="Localización" status={statusStep2} />
          <Steps.Item title="Antecedentes" status={statusStep3} />
          <Steps.Item title="Cadena de Valor" status={statusStep4} />
          <Steps.Item title="Contactos" status={statusStep5} />
        </Steps>
        <br />
        <Panel>
          {/* ============================ DATOS GENERALES ============================ */}
          {step === 0 ? (
            <Form
              fluid
              style={{ width: "85%", margin: "0 auto" }}
              autoSave="true"
            >
              {/* CUIT */}
              <Form.Group controlId="cuit">
                <Form.ControlLabel>CUIT *</Form.ControlLabel>
                <InputGroup>
                  <Input
                    maxLength={2}
                    style={{ textAlign: "center" }}
                    defaultValue={formData.cuit1}
                    onChange={(e, e2) => {
                      setFormData({ ...formData, cuit1: e2.target.value });
                    }}
                  />
                  <InputGroup.Addon>-</InputGroup.Addon>
                  <Input
                    style={{ textAlign: "center", width: "200px" }}
                    defaultValue={formData.cuit2}
                    onChange={(e, e2) => {
                      setFormData({ ...formData, cuit2: e2.target.value });
                    }}
                  />
                  <InputGroup.Addon>-</InputGroup.Addon>
                  <Input
                    maxLength={1}
                    defaultValue={formData.cuit3}
                    onChange={(e, e2) => {
                      setFormData({ ...formData, cuit3: e2.target.value });
                    }}
                  />
                </InputGroup>
              </Form.Group>
              {/* Tamaño SePyme */}
              <Form.Group controlId="tamaño_sepyme">
                <Form.ControlLabel>Tamaño SePYME</Form.ControlLabel>
                <SelectPicker
                  name="tamaño_sepyme"
                  id="tamaño_sepyme"
                  data={tamaños_select}
                  block
                  placeholder="Seleccione un tamaño"
                  searchable={false}
                  defaultValue={formData.tamaño_sepyme}
                  onSelect={(value) => {
                    setFormData({ ...formData, tamaño_sepyme: value });
                  }}
                  onClean={() =>
                    setFormData({ ...formData, tamaño_sepyme: "" })
                  }
                />
              </Form.Group>
              {/* Razón Social */}
              <Form.Group controlId="razon_social">
                <Form.ControlLabel>Razón Social *</Form.ControlLabel>
                <Form.Control
                  name="razon_social"
                  defaultValue={formData.razon_social}
                  onChange={(e, e2) => {
                    setFormData({ ...formData, razon_social: e2.target.value });
                  }}
                />
              </Form.Group>
              {/* Domicilio */}
              <Form.Group controlId="domicilio">
                <Form.ControlLabel>Domicilio *</Form.ControlLabel>
                <Form.Control
                  name="domicilio"
                  defaultValue={formData.domicilio}
                  onChange={(e, e2) => {
                    setFormData({ ...formData, domicilio: e2.target.value });
                  }}
                />
              </Form.Group>
              {/* Descripción */}
              <Form.Group controlId="descripcion">
                <Form.ControlLabel>
                  Descripción de la empresa*
                </Form.ControlLabel>
                <Form.Control
                  rows={3}
                  name="descripcion"
                  maxLength={400}
                  accepter={Textarea}
                  defaultValue={formData.descripcion}
                  onChange={(e, e2) =>
                    setFormData({ ...formData, descripcion: e2.target.value })
                  }
                />
                <Form.HelpText>
                  Breve descripción de las actividades de la empresa. Máx. 150
                  caracteres
                </Form.HelpText>
              </Form.Group>
              {/* Link web */}
              <Form.Group controlId="link_web">
                <Form.ControlLabel>Link Web</Form.ControlLabel>
                <Form.Control
                  name="link_web"
                  defaultValue={formData.link_web}
                  onChange={(e, e2) =>
                    setFormData({ ...formData, link_web: e2.target.value })
                  }
                />
                <Form.HelpText>
                  Web principal de la empresa, en caso de que no exista, link a
                  LinkedIn o alguna web donde encontrar más información de la
                  empresa
                </Form.HelpText>
              </Form.Group>
              {/* Link CRM */}
              <Form.Group controlId="link_CRM">
                <Form.ControlLabel>Link CRM</Form.ControlLabel>
                <Form.Control
                  name="link_CRM"
                  defaultValue={formData.link_crm}
                  onChange={(e, e2) =>
                    setFormData({ ...formData, link_crm: e2.target.value })
                  }
                />
                <Form.HelpText>
                  La búsqueda de la empresa puede hacerse en{" "}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://crm.inti.gob.ar/index.php?module=Accounts&action=index"
                  >
                    USUARIOS EXTERNOS CRM
                  </a>
                  filtrando en el ícono del embudo
                </Form.HelpText>
              </Form.Group>
            </Form>
          ) : null}

          {/* ============================= LOCALIZACIÓN =============================== */}

          {step === 1 ? (
            <Form fluid style={{ width: "85%", margin: "0 auto" }}>
              {/* PROVINCIA */}
              <Form.Group controlId="provincia">
                <Form.ControlLabel>Provincia *</Form.ControlLabel>
                <SelectPicker
                  defaultValue={formData.provincia}
                  id="provincia"
                  data={provincias_select}
                  block
                  placeholder="Seleccione una provincia"
                  searchable={false}
                  required
                  onClean={() => {
                    setCiudadesDisabled(true);
                    setParquesDisabled(true);
                    setFormData({ ...formData, provincia: "" });
                  }}
                  onSelect={handleProvinciaSelect}
                />
              </Form.Group>

              {/* CIUDAD */}
              <Form.Group controlId="ciudad">
                <Form.ControlLabel>Ciudad *</Form.ControlLabel>
                <SelectPicker
                  defaultValue={formData.ciudad}
                  id="ciudad"
                  data={ciudades}
                  block
                  placeholder="Seleccione una ciudad"
                  searchable={true}
                  onClean={() => {
                    setParquesDisabled(true);
                    setFormData({
                      ...formData,
                      ciudad: "",
                      parque_industrial: "",
                    });
                  }}
                  disabled={ciudadesDisabled}
                  onSelect={async (value) => {
                    await handleCiudadSelect(value);
                  }}
                />
              </Form.Group>

              {/* PARQUES INDUSTRIALES */}
              <Form.Group controlId="parque_industrial">
                <Form.ControlLabel>Parque Industrial *</Form.ControlLabel>
                <SelectPicker
                  onClean={() =>
                    setFormData({ ...formData, parque_industrial: "" })
                  }
                  defaultValue={formData.parque_industrial}
                  id="parque_industrial"
                  data={parques}
                  block
                  placeholder="Seleccione un parque"
                  searchable={false}
                  disabled={parquesDisabled}
                  onSelect={(value) => {
                    setFormData({ ...formData, parque_industrial: value });
                  }}
                />

                <Form.HelpText style={{ margin: "10px 0" }}>
                  Cargar la ubicación de la PLANTA PRINCIPAL de la empresa
                </Form.HelpText>
              </Form.Group>
            </Form>
          ) : null}

          {/* ============================= ANTECEDENTES =============================== */}

          {step === 2 ? (
            <>
              <Table virtualized data={formData.antecedentes} height={300}>
                <Column flexGrow={1} align="center" fixed>
                  <HeaderCell>Programa/Motivo</HeaderCell>
                  <Cell dataKey="motivo" />
                </Column>

                <Column width={80} align="center">
                  <HeaderCell>Año</HeaderCell>
                  <Cell dataKey="año" />
                </Column>

                <Column flexGrow={1} align="center">
                  <HeaderCell>Estado</HeaderCell>
                  <Cell dataKey="estado" />
                </Column>

                <Column width={80} align="center">
                  <HeaderCell></HeaderCell>
                  <Cell style={{ padding: "6px" }}>
                    {(rowData) => (
                      <Button
                        appearance="primary"
                        color="blue"
                        onClick={() => editarAntecedente(rowData)}
                      >
                        Editar
                      </Button>
                    )}
                  </Cell>
                </Column>

                <Column width={80} align="center">
                  <HeaderCell></HeaderCell>
                  <Cell style={{ padding: "6px" }}>
                    {(rowData) => (
                      <Button
                        appearance="primary"
                        color="red"
                        onClick={() => borrarAntecedente(rowData)}
                      >
                        Borrar
                      </Button>
                    )}
                  </Cell>
                </Column>
              </Table>

              <Button block appearance="primary" onClick={handleOpenAdd}>
                Añadir antecedente
              </Button>

              {/* ==========================  MODAL AGREGAR =============================== */}

              <Modal
                overflow={false}
                style={{ translate: "0 -40px" }}
                open={openAdd}
                onClose={handleCloseAdd}
              >
                <Modal.Header>
                  <Modal.Title>Añadir antecedente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form fluid onSubmit={handleSubmitAgregarAntecedente}>
                    {/* RESUMEN */}
                    <Form.Group controlId="resumen">
                      <Form.ControlLabel>RESUMEN *</Form.ControlLabel>
                      <Form.Control
                        rows={5}
                        name="textarea"
                        accepter={Textarea}
                        required
                      />
                      <Form.HelpText>
                        Breve descripción de la intervención - oportunidades de
                        mejora abordadas o ejes trabajados
                      </Form.HelpText>
                    </Form.Group>

                    {/* PROGRAMA/MOTIVO */}
                    <Form.Group controlId="programa">
                      <Form.ControlLabel>PROGRAMA/MOTIVO *</Form.ControlLabel>
                      <SelectPicker
                        required
                        data={programasSelect}
                        searchable={false}
                        placeholder="Seleccione un programa"
                        block
                        id="programa"
                      />
                    </Form.Group>

                    {/* AÑO */}
                    <Form.Group controlId="año">
                      <Form.ControlLabel>AÑO *</Form.ControlLabel>
                      <AutoComplete
                        block
                        data={añosSelect}
                        placeholder="Seleccione un año"
                      />
                    </Form.Group>

                    {/* ESTADO */}
                    <Form.Group controlId="estado">
                      <Form.ControlLabel>ESTADO *</Form.ControlLabel>
                      <SelectPicker
                        required
                        data={estados}
                        searchable={false}
                        placeholder="Seleccione el estado"
                        block
                        id="estado"
                      />
                    </Form.Group>

                    {/* HERRAMIENTAS */}
                    <Form.Group controlId="herramientas">
                      <Form.ControlLabel>HERRAMIENTAS</Form.ControlLabel>
                      <TagPicker
                        id="herramientas"
                        data={herramientas}
                        block
                        placement="auto"
                        placeholder="Seleccione las herramientas"
                        tagProps={{ color: "red" }}
                      />
                    </Form.Group>

                    {/* CIUDAD */}
                    <Form.Group controlId="ciudad">
                      <Form.ControlLabel>CIUDAD</Form.ControlLabel>
                      <SelectPicker
                        onSearch={async (value) => {
                          await busquedaCiudades(value);
                        }}
                        id="ciudad"
                        data={ciudadesBusqueda}
                        block
                        placeholder="Seleccione la ciudad"
                        tagProps={{ color: "red" }}
                      />
                    </Form.Group>

                    {/* ASESORES */}
                    <Form.Group controlId="asesores">
                      <Form.ControlLabel>ASESORES</Form.ControlLabel>
                      <TagPicker
                        id="asesores"
                        data={asesores}
                        block
                        placeholder="Seleccione los asesores"
                        tagProps={{ color: "green" }}
                        placement="auto"
                      />
                    </Form.Group>

                    <Button appearance="primary" type="submit">
                      Guardar
                    </Button>
                    <Button
                      onClick={handleCloseAdd}
                      appearance="subtle"
                      color="red"
                      style={{ margin: "0 10px" }}
                    >
                      Cancelar
                    </Button>
                  </Form>
                </Modal.Body>
              </Modal>

              {/* ==========================  MODAL EDITAR =============================== */}
              <Modal
                overflow={false}
                style={{ translate: "0 -30px" }}
                open={openEdit}
                onClose={handleCloseEdit}
              >
                <Modal.Header>
                  <Modal.Title>Editar antecedente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form fluid onSubmit={handleSubmitEditarAntecedente}>
                    {/* RESUMEN */}
                    <Form.Group controlId="resumen">
                      <Form.ControlLabel>RESUMEN</Form.ControlLabel>
                      <Form.Control
                        rows={5}
                        name="textarea"
                        accepter={Textarea}
                        required
                        defaultValue={antecedenteEditable.resumen}
                      ></Form.Control>
                      <Form.HelpText>
                        Breve descripción del contacto con la empresa
                      </Form.HelpText>
                    </Form.Group>

                    {/* PROGRAMA/MOTIVO */}
                    <Form.Group controlId="programa">
                      <Form.ControlLabel>PROGRAMA/MOTIVO *</Form.ControlLabel>
                      <SelectPicker
                        required
                        data={programasSelect}
                        searchable={false}
                        placeholder="Seleccione un programa"
                        block
                        id="programa"
                        defaultValue={antecedenteEditable.motivo}
                        disabled
                      ></SelectPicker>
                    </Form.Group>

                    {/* AÑO */}
                    <Form.Group controlId="año">
                      <Form.ControlLabel>AÑO *</Form.ControlLabel>
                      <AutoComplete
                        block
                        data={añosSelect}
                        placeholder="Seleccione un año"
                        defaultValue={antecedenteEditable.año}
                        disabled
                      />
                    </Form.Group>

                    {/* ESTADO */}
                    <Form.Group controlId="estado">
                      <Form.ControlLabel>ESTADO *</Form.ControlLabel>
                      <SelectPicker
                        required
                        data={estados}
                        searchable={false}
                        placeholder="Seleccione el estado"
                        block
                        id="estado"
                        defaultValue={antecedenteEditable.estado}
                      />
                    </Form.Group>

                    {/* HERRAMIENTAS */}
                    <Form.Group controlId="herramientas">
                      <Form.ControlLabel>HERRAMIENTAS</Form.ControlLabel>
                      <TagPicker
                        id="herramientas"
                        data={herramientas}
                        block
                        placeholder="Seleccione las herramientas"
                        tagProps={{ color: "red" }}
                        defaultValue={antecedenteEditable.herramientas}
                      />
                    </Form.Group>

                    {/* CIUDAD */}
                    <Form.Group controlId="ciudad">
                      <Form.ControlLabel>CIUDAD</Form.ControlLabel>
                      <SelectPicker
                        onSearch={async (value) => {
                          await busquedaCiudades(value);
                        }}
                        id="ciudad"
                        data={ciudadesBusqueda}
                        block
                        defaultValue={antecedenteEditable.ciudad}
                        placeholder="Seleccione la ciudad"
                        tagProps={{ color: "red" }}
                      />
                    </Form.Group>

                    {/* ASESORES */}
                    <Form.Group controlId="asesores">
                      <Form.ControlLabel>ASESORES *</Form.ControlLabel>
                      <TagPicker
                        id="asesores"
                        data={asesores}
                        block
                        placeholder="Seleccione los asesores"
                        tagProps={{ color: "green" }}
                        defaultValue={antecedenteEditable.asesores}
                        placement="autoVerticalStart"
                      />
                    </Form.Group>
                    <Button appearance="primary" type="submit">
                      Guardar
                    </Button>
                    <Button
                      onClick={handleCloseEdit}
                      appearance="subtle"
                      color="red"
                      style={{ margin: "0 10px" }}
                    >
                      Cancelar
                    </Button>
                  </Form>
                </Modal.Body>
              </Modal>
            </>
          ) : null}

          {/* ============================= CADENA DE VALOR =============================== */}

          {step === 3 ? (
            <>
              <Form fluid>
                {/* ========================= SECTOR DE PERTENENCIA  ======================= */}
                <Form.Group controlId="sector_pertenece">
                  <Form.ControlLabel>SECTOR DE PERTENENCIA *</Form.ControlLabel>
                  <SelectPicker
                    required
                    block
                    //GET DATA
                    data={sectores}
                    id="sector_pertenece"
                    searchable={true}
                    placeholder="Seleccione un sector"
                    onSelect={(value) =>
                      setFormData({ ...formData, sector_pertenece: value })
                    }
                    onClean={() =>
                      setFormData({ ...formData, sector_pertenece: "" })
                    }
                    defaultValue={formData.sector_pertenece}
                  />
                  <Form.HelpText>
                    Sector principal al cual PERTENECE la empresa
                  </Form.HelpText>
                </Form.Group>

                {/* ========================= SECTORES QUE PROVEE  ======================= */}

                <Form.Group controlId="sectores_provee">
                  <Form.ControlLabel>
                    SECTOR(ES) A LOS QUE PROVEE *
                  </Form.ControlLabel>
                  <TagPicker
                    id="sectores_provee"
                    data={sectores}
                    block
                    placeholder="Seleccione los sectores"
                    tagProps={{ color: "orange" }}
                    placement="auto"
                    onSelect={(value) => {
                      setFormData({ ...formData, sectores_provee: value });
                    }}
                    defaultValue={formData.sectores_provee}
                  />
                  <Form.HelpText>
                    Al menos uno o varios sectores a los cuales brinda
                    servicios/productos
                  </Form.HelpText>
                </Form.Group>

                <Form.Group controlId="clae" style={{ width: "100%" }}>
                  <Form.ControlLabel>
                    CLAE - Clasificador de actividad económica
                  </Form.ControlLabel>

                  <InputGroup>
                    <Input id="codigo_clae" onPressEnter={obtenerClae} />
                    <InputGroup.Button>
                      <SearchIcon />
                    </InputGroup.Button>
                  </InputGroup>

                  <Form.HelpText>
                    Agregue los códigos de CLAE, los mismos se pueden encontrar
                    en{" "}
                    <a
                      href="https://www.cuitonline.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      CUIT ONLINE
                    </a>
                    .
                  </Form.HelpText>
                </Form.Group>

                <p className="header">CLAES ENCONTRADOS</p>
                <Form.HelpText style={{ fontSize: 15, color: "black" }}>
                  {claesEmpresa.length > 0 ? (
                    claesEmpresa.map((clae) => {
                      return (
                        <div
                          key={clae.codigo_clae}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            margin: "5px 20px",
                          }}
                        >
                          <p>
                            {" "}
                            {clae.codigo_clae} - {clae.seccion_clae} -{" "}
                            {clae.descripcion_actividad}
                          </p>

                          <IconButton
                            style={{ float: "right" }}
                            appearance="primary"
                            color="red"
                            icon={<CloseIcon />}
                            circle
                            size="xs"
                            onClick={() => {
                              borrarClae(clae.codigo_clae);
                            }}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <p>-</p>
                  )}
                </Form.HelpText>
              </Form>
            </>
          ) : null}

          {/* ====================== CONTACTO DE LA EMPRESA  ====================== */}
          {step === 4 ? (
            <>
              <Form fluid onSubmit={handleSubmitAgregarContacto}>
                <Form.Group controlId="nombre_contacto">
                  <Form.ControlLabel>NOMBRE DEL CONTACTO*</Form.ControlLabel>
                  <Form.Control name="nombre_contacto" />
                </Form.Group>
                <Form.Group controlId="puesto_contacto">
                  <Form.ControlLabel>PUESTO</Form.ControlLabel>
                  <Form.Control name="puesto_contacto" />
                </Form.Group>
                <Form.Group controlId="email">
                  <Form.ControlLabel>EMAIL</Form.ControlLabel>
                  <Form.Control name="email" type="email" />
                </Form.Group>
                <Form.Group controlId="telefono">
                  <Form.ControlLabel>TELÉFONO</Form.ControlLabel>
                  <Form.Control name="telefono" type="tel" />
                </Form.Group>

                <Form.HelpText>
                  Se debe añadir contactos de los cuales se conozca su email o
                  telefono.
                </Form.HelpText>
                <br />

                <Button appearance="primary" type="submit" block>
                  Agregar contacto
                </Button>
              </Form>

              {/* Cards de contactos */}
              <PanelGroup
                style={{ margin: "10px 0" }}
                accordion
                defaultActiveKey={1}
                bordered
              >
                {/* Para cada contacto se crea un panel con los datos y la opción de borrar */}
                {formData.contactos.map((contacto, index) => (
                  <Panel
                    header={contacto.nombre}
                    key={contacto.nombre}
                    eventKey={index}
                    id={`panel${index}`}
                  >
                    <p className="header">Teléfono</p>
                    <p>{contacto.telefono}</p>
                    <p className="header">Mail</p>
                    <p>{contacto.email}</p>
                    <p className="header">Puesto</p>
                    <p>{contacto.puesto}</p>
                    <br />
                    <Button
                      appearance="primary"
                      color="red"
                      onClick={() => handleDeleteContacto(index)}
                    >
                      Eliminar Contacto
                    </Button>
                  </Panel>
                ))}
              </PanelGroup>

              <Button
                appearance="primary"
                color="green"
                onClick={() => {
                  cargarEmpresa();

                  setTimeout(() => {
                  navigate(`/${formData.cuit1}${formData.cuit2}${formData.cuit3}`); 
                  }, 2000)
                  
                  
                }}
                block
                disabled={
                  statusStep1 === "error" ||
                  statusStep2 === "error" ||
                  statusStep4 === "error"
                }
              >
                Cargar empresa
              </Button>

              {statusStep1 === "error" ? (
                <Form.HelpText style={{ color: "red", textAlign: "center" }}>
                  Hay datos obligatorios incompletos en el paso 1
                </Form.HelpText>
              ) : null}

              {statusStep2 === "error" ? (
                <Form.HelpText style={{ color: "red", textAlign: "center" }}>
                  Hay datos obligatorios incompletos en el paso 2
                </Form.HelpText>
              ) : null}

              {statusStep4 === "error" ? (
                <Form.HelpText style={{ color: "red", textAlign: "center" }}>
                  Hay datos obligatorios incompletos en el paso 4
                </Form.HelpText>
              ) : null}
            </>
          ) : null}
        </Panel>
        <br />

        <ButtonGroup style={{ margin: "10px 0 80px 0" }}>
          <Button
            onClick={onPrevious}
            disabled={step === 0}
            appearance="primary"
          >
            Anterior
          </Button>
          <Button onClick={onNext} disabled={step === 4} appearance="primary">
            Siguiente
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

export default Agregar;
