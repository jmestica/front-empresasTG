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

function Agregar() {
  //================================== STATES ===================================

  //Formulario de pasos
  const [step, setStep] = useState(0);

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

  //Modal
  const [open, setOpen] = useState(false);

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


  //traer de api
  const [herramientas, setHerramientas] = useState(test_herramientas);

  const [tags, setTags] = useState([]);


  //====================== STEPS HANDLER =============================

  const onChange = (nextStep) => {
    setStep(nextStep < 0 ? 0 : nextStep > 4 ? 4 : nextStep);

    console.log(formData);
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

    const herramientas = e2.target.herramientas.defaultValue.split(',');

    const nuevo_antecedente = {
      resumen: e2.target.resumen.value,
      motivo: e2.target.programa.defaultValue,
      año: e2.target.año.defaultValue,
      estado: e2.target.estado.defaultValue,
      herramientas: herramientas,
    };

    setFormData({
      ...formData,
      antecedentes: [...formData.antecedentes, nuevo_antecedente],
    });

    handleCloseAdd();
  };

  const borrarAntecedente = (rowData) => { 

      const actual = formData.antecedentes

      const antecedentesUpdate = actual.filter((item) => {

        return item.motivo !== rowData.motivo ||
               item.año !== rowData.año ||
               item.estado !== rowData.estado;
      });

      setFormData({...formData, antecedentes: antecedentesUpdate})      
    
  }


  const editarAntecedente = (rowData) => { 

    console.log(rowData)

  }


  const handleOpenAdd = () => {
    setOpen(true)
    setTags([])
  }

  const handleCloseAdd = () => {
    setOpen(false)
    setTags([])
  };

  // ============================================================================

  return (
    <div>
      <div className="section-title">AGREGAR EMPRESA</div>

      <div className="step-container">
        <Steps current={step}>
          <Steps.Item title="Datos Generales" />
          <Steps.Item title="Localización" />
          <Steps.Item title="Antecedentes" />
          <Steps.Item title="Cadena de Valor" />
          <Steps.Item title="Contactos" />
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
                <Form.ControlLabel>Descripción *</Form.ControlLabel>
                <Form.Control
                  rows={3}
                  name="descripcion"
                  accepter={Textarea}
                  defaultValue={formData.descripcion}
                  onChange={(e, e2) =>
                    setFormData({ ...formData, descripcion: e2.target.value })
                  }
                />
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
              </Form.Group>
            </Form>
          ) : null}

          {/* ============================= ANTECEDENTES =============================== */}

          {step === 2 ? (
            <>
              <Table
                virtualized
                data={formData.antecedentes}
                height={300}
            
              >
                <Column flexGrow={1} align="center" fixed>
                  <HeaderCell>Programa/Motivo</HeaderCell>
                  <Cell dataKey="motivo"/>
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
                  <Cell style={{padding: '6px'}}>
                  {rowData => (
                    <Button appearance="primary" color="blue" onClick={() => editarAntecedente(rowData)}>
                      Editar
                    </Button>
                  )}
                  
                  </Cell>
                </Column>

                <Column width={80} align="center">
                  <HeaderCell></HeaderCell>
                  <Cell style={{padding: '6px'}}>
                  {rowData => (
                    <Button appearance="primary" color="red" onClick={() => borrarAntecedente(rowData)}>
                      Borrar
                    </Button>
                  )}
                  
                  </Cell>
                </Column>
              </Table>

              <Button block appearance="primary" onClick={handleOpenAdd}>
                Añadir antecedente
              </Button>

              <Modal overflow={true} open={open} onClose={handleCloseAdd}>
                <Modal.Header>
                  <Modal.Title>Añadir antecedente</Modal.Title>
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
                      />
                      <Form.HelpText>
                        Breve descripción del contacto con la empresa
                      </Form.HelpText>
                    </Form.Group>

                    {/* PROGRAMA/MOTIVO */}
                    <Form.Group controlId="programa">
                      <Form.ControlLabel>PROGRAMA/MOTIVO</Form.ControlLabel>
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
                      <Form.ControlLabel>AÑO</Form.ControlLabel>
                      <SelectPicker
                        required
                        data={añosSelect}
                        searchable={false}
                        placeholder="Seleccione el año"
                        block
                        id="año"
                      />
                    </Form.Group>

                    {/* ESTADO */}
                    <Form.Group controlId="estado">
                      <Form.ControlLabel>ESTADO</Form.ControlLabel>
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

                      <TagPicker id="herramientas" data={test_herramientas} block placeholder="Seleccione las herramientas" tagProps={{color: 'red'}} />

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
            </>
          ) : null}
        </Panel>
        <br />
        <ButtonGroup>
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
