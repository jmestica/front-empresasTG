import { useState } from "react";
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
  useToaster,
} from "rsuite";

const { Column, HeaderCell, Cell } = Table;
import "./agregar.css";
import React from "react";

// eslint-disable-next-line react/display-name
const Textarea = React.forwardRef((props, ref) => (
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

const provincias_select = ["Neuquén", "Río Negro", "Chubut", "Santa Cruz"].map(
  (item) => ({ label: item, value: item })
);

const programasSelect = [
  "Kaizen Tango",
  "PRODEPRO AT",
  "PRODEPRO ANR",
  "PAC",
  "PRODUCTIVIDAD 4.0",
  "AT Sin Financiamiento",
].map((item) => ({ label: item, value: item }));

const estados = [
  "Potencial",
  "En Proceso",
  "Presentó",
  "Aprobado",
  "En curso",
  "Finalizado",
  "No avanzó"
].map((item) => ({ label: item, value: item }));

const añosSelect = ["2023", "2022", "2021", "2020", "2019"];

//============================================================================




function Agregar() {
  //================================== STATES ===================================

  //Formulario de pasos
  const [step, setStep] = useState(0);
  const [statusStep1, setStatusStep1] = useState("process");
  const [statusStep2, setStatusStep2] = useState("process");
  const [statusStep3, setStatusStep3] = useState("process");
  const [statusStep4, setStatusStep4] = useState("process");
  const [statusStep5, setStatusStep5] = useState("process");

  //Datos del formulario
  const [formData, setFormData] = useState({
    cuit1: "30",
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
  });

  //Modal y notificación
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [type, setType] = useState('');
  const [header, setHeader] = useState('')
  const [message, setMessage] = useState('');
  const toaster = useToaster();

  //Datos de localización
  const [ciudades, setCiudades] = useState([]);
  const [parques, setParques] = useState([]);
  const [ciudadesDisabled, setCiudadesDisabled] = useState(true);
  const [parquesDisabled, setParquesDisabled] = useState(true);

  //Datos de antecedentes
  const test_herramientas = [
    "5S",
    "PDCA",
    "Kaizen",
    "Layout",
    "SMED",
    "TPM",
  ].map((item) => ({ label: item, value: item }));


  const datos_asesores = [
    "Alonso Diana",
    "Alvez Pricila",
    "Bribarelli María Virginia",
    "Lizzadro Carolina",
    "Maidana Ain",
    "Mazzitelli Nicolás Pedro",
    "Mestica Juan Martin",
    "Plache Agustín Nicolas",
    "Rico Abel Adolfo"
  ].map((item) => ({ label: item, value: item }));

  

  //traer de api
  const [herramientas, setHerramientas] = useState(test_herramientas);

  const [tags, setTags] = useState([]);

  const [antecedenteEditable, setAntecedenteEditable] = useState({});

  // ============================ NOTIFICACIÓN =======================

  const notificacion = (
    <Notification type={type} header={header} style={{marginLeft: '320px'}} closable>
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
      setStatusStep3("process")

      if(
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
      setStatusStep3("finish")
    }

    // else if (nextStep === 4) {

    // }


  };

  const onNext = () => onChange(step + 1);
  const onPrevious = () => onChange(step - 1);

  //================================  HANDLERS ====================================

  const handleProvinciaSelect = (value) => {
    setFormData({ ...formData, provincia: value });

    //fetch api con value seleccionado para obtener las ciudades de esa provincia
    setCiudadesDisabled(false);
  };

  const handleCiudadSelect = (value) => {
    //fetch api con value seleccionado para obtener las parques de esa ciudad
    setParquesDisabled(false);

    setFormData({ ...formData, ciudad: value });

    const parques_select = ["No pertenece a parque"].map((item) => ({
      label: item,
      value: item,
    }));

    setParques(parques_select);
  };

  const handleSubmitAgregarAntecedente = (e, e2) => {

    //Generación de objetos
    const herramientas = e2.target.herramientas.defaultValue.split(",")
    const asesores = e2.target.asesores.defaultValue.split(",")

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
    if(nuevo_antecedente.resumen && nuevo_antecedente.motivo && nuevo_antecedente.año && nuevo_antecedente.estado){
    

      setFormData({
        ...formData,
        antecedentes: [...formData.antecedentes, nuevo_antecedente],
      });

      handleCloseAdd();
  
    } else {
        setMessage('Hay campos obligatorios incompletos')
        setType('error')
        setHeader('Campos obligatorios')
        toaster.push(notificacion)
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
    })

    handleOpenEdit()

  };

  const handleOpenEdit = () => {
    setOpenEdit(true)
  }

  const handleOpenAdd = () => {
    setOpenAdd(true)
    setTags([])
  };

  const handleCloseAdd = () => {
    setOpenAdd(false)
    setTags([])
  };

  const handleCloseEdit = () => {
    setOpenEdit(false)
  };

  // ==================================== COMPONENTE =======================================

  return (
    <div>
      <div className="section-title">AGREGAR EMPRESA</div>

      <div className="step-container">
        <Steps current={step}>
          <Steps.Item title="Datos Generales" status={statusStep1} />
          <Steps.Item title="Localización" status={statusStep2}/>
          <Steps.Item title="Antecedentes" status={statusStep3}/>
          <Steps.Item title="Cadena de Valor" status={statusStep4}/>
          <Steps.Item title="Contactos" status={statusStep5}/>
        </Steps>
        <br/>
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
                  <Input value={30} style={{ textAlign: "center" }} />
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
                    value={formData.cuit3}
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
                <Form.ControlLabel>Descripción de la empresa*</Form.ControlLabel>
                <Form.Control
                  rows={3}
                  name="descripcion"
                  maxLength={150}
                  accepter={Textarea}
                  defaultValue={formData.descripcion}
                  onChange={(e, e2) =>
                    setFormData({ ...formData, descripcion: e2.target.value })
                  }
                />
                <Form.HelpText>Breve descripción de las actividades de la empresa. Máx. 150 caracteres</Form.HelpText>

              
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
                <Form.HelpText>Web principal de la empresa, en caso de que no exista, link a LinkedIn o alguna web donde encontrar más información de la empresa</Form.HelpText>

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
                <Form.HelpText>La búsqueda de la empresa puede hacerse en <a href="https://crm.inti.gob.ar/index.php?module=Accounts&action=index"> USUARIOS EXTERNOS CRM</a>  filtrando en el ícono del embudo</Form.HelpText>

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
                  data={provincias_select}
                  block
                  placeholder="Seleccione una ciudad"
                  searchable={true}
                  onClean={() => {
                    setParquesDisabled(true);
                    formData.ciudad = "";
                  }}
                  disabled={ciudadesDisabled}
                  onSelect={handleCiudadSelect}
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
                  onSelect={(value) =>
                    setFormData({ ...formData, parque_industrial: value })
                  }
                />

              <Form.HelpText style={{margin: '10px 0'}}> Cargar la ubicación de la PLANTA PRINCIPAL de la empresa</Form.HelpText>

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

              <Modal overflow={false} style={{translate: '0 -40px'}} open={openAdd} onClose={handleCloseAdd}>
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
                        Breve descripción del contacto con la empresa/proyecto presentado
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
                        data={test_herramientas}
                        block
                        placeholder="Seleccione las herramientas"
                        tagProps={{ color: "red" }}
                      />
                    </Form.Group>

                     {/* CIUDAD */}
                     <Form.Group controlId="ciudad">
                      <Form.ControlLabel>CIUDAD</Form.ControlLabel>
                      <SelectPicker
                        //ASYNC
                        id="ciudad"
                        data={test_herramientas}
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
                        data={datos_asesores}
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
              <Modal overflow={false} style={{translate: '0 -30px'}} open={openEdit} onClose={handleCloseEdit}>
                <Modal.Header>
                  <Modal.Title>Editar antecedente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form fluid onSubmit={handleSubmitAgregarAntecedente}>
                    {/* RESUMEN */}
                    <Form.Group controlId="resumen">
                      <Form.ControlLabel>RESUMEN</Form.ControlLabel>
                      <Form.Control
                        rows={5}
                        name="textarea"
                        accepter={Textarea}
                        required
                        defaultValue={antecedenteEditable.resumen}
                      >
                      </Form.Control>
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
                      >
                      </SelectPicker>
                    </Form.Group>

                    {/* AÑO */}
                    <Form.Group controlId="año">
                      <Form.ControlLabel>AÑO *</Form.ControlLabel>
                      <AutoComplete
                        block
                        data={añosSelect}
                        placeholder="Seleccione un año"
                        defaultValue={antecedenteEditable.año}
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
                        data={test_herramientas}
                        block
                        placeholder="Seleccione las herramientas"
                        tagProps={{ color: "red" }}
                        defaultValue={antecedenteEditable.herramientas}
                      />
                    </Form.Group>

                    
                     {/* CIUDAD */}
                     <Form.Group controlId="ciudad">
                      <Form.ControlLabel>CIUDAD *</Form.ControlLabel>
                      <SelectPicker
                        //ASYNC
                        id="ciudad"
                        data={test_herramientas}
                        block
                        placeholder="Seleccione la ciudad"
                        tagProps={{ color: "red" }}
                        defaultValue={antecedenteEditable.ciudad}
                      />
                    </Form.Group>

                    {/* ASESORES */}
                    <Form.Group controlId="asesores">
                      <Form.ControlLabel>ASESORES *</Form.ControlLabel>
                      <TagPicker
                        id="asesores"
                        data={datos_asesores}
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
        </Panel>
        <br />
        <ButtonGroup style={{margin: '10px 0 80px 0'}}>
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
