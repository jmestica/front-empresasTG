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
} from "rsuite";
import "./agregar.css";
import React from "react";

// eslint-disable-next-line react/display-name
const Textarea = React.forwardRef((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));

//==================================== SELECT PICKER DATA ============================
const tamaños_select = ['Micro', 'Pequeña', 'Mediana - Tramo 1', 'Mediana - Tramo 2', 'No conocido'].map(
  item => ({ label: item, value: item })
);

const provincias_select = ['Neuquén', 'Río Negro', 'Chubut', 'Santa Cruz'].map(
  item => ({ label: item, value: item })
);

function Agregar() {

  //====================== STATES =============================

  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    cuit1: '30',
    cuit2: '',
    cuit3: '',
    tamaño_sepyme: '',
    razon_social:'',
    domicilio: '',
    descripcion: '',
    link_web: '',
    link_crm: '',
    provincia: '',
    ciudad: '',
    parque_industrial: '',
  });
  
  
  const [ciudades, setCiudades] = useState([]);
  const [parques, setParques] = useState([]);
  const [ciudadesDisabled, setCiudadesDisabled] = useState(true);
  const [parquesDisabled, setParquesDisabled] = useState(true);

  

  //====================== STEPS HANDLER =============================

  const onChange = (nextStep) => {
    setStep(nextStep < 0 ? 0 : nextStep > 4 ? 4 : nextStep);

    console.log(formData)


  };

  const onNext = () => onChange(step + 1);
  const onPrevious = () => onChange(step - 1);


//====================== LOCALIZACIÓN HANDLER =============================

const handleProvinciaSelect = (value) => {
    //fetch api con value seleccionado para obtener las ciudades de esa provincia
      setCiudadesDisabled(false)    
      console.log(value)
}


const handleCiudadSelect = (value) => {
    //fetch api con value seleccionado para obtener las parques de esa ciudad
      setParquesDisabled(false)   
      console.log(value) 
}




  return (
    <div>
      <div className="section-title">AGREGAR EMPRESA</div>

      <div className="step-container">
        <Steps current={step}>
          <Steps.Item title="Datos Generales" />
          <Steps.Item title="Localización" />
          <Steps.Item title="Antecedentes" />
          <Steps.Item title="Cadena de Valor" />
          <Steps.Item title="CLAE" />
        </Steps>
        <br />
        <Panel>
          {/* ============================ DATOS GENERALES ============================ */}
          {step === 0 ? (
            <Form fluid style={{ width: "85%", margin: "0 auto" }} autoSave="true">
              {/* CUIT */}
              <Form.Group controlId="cuit">
                <Form.ControlLabel>CUIT</Form.ControlLabel>
                <InputGroup>
                  <Input value={30} style={{ textAlign: "center" }} />
                  <InputGroup.Addon>-</InputGroup.Addon>
                  <Input style={{ textAlign: "center", width: "200px" }} defaultValue={formData.cuit2} onChange={(e, e2)=>{setFormData({...formData, cuit2: e2.target.value})}}/>
                  <InputGroup.Addon>-</InputGroup.Addon>
                  <Input maxLength={1} defaultValue={formData.cuit3} onChange={(e, e2)=>{setFormData({...formData, cuit3: e2.target.value})}} value={formData.cuit3}/>
                </InputGroup>
              </Form.Group>
              {/* Tamaño SePyme */}
              <Form.Group controlId="tamaño_sepyme">
                <Form.ControlLabel>Tamaño SePYME</Form.ControlLabel>
                <SelectPicker id="tamaño_sepyme" data={tamaños_select} block placeholder="Seleccione un tamaño" searchable={false} defaultValue={formData.tamaño_sepyme} onSelect={(value)=>{setFormData({...formData, tamaño_sepyme: value})}} onClean={()=> setFormData({...formData, tamaño_sepyme: ''})}/>
              </Form.Group>
              {/* Razón Social */}
              <Form.Group controlId="razon_social">
                <Form.ControlLabel>Razón Social</Form.ControlLabel>
                <Form.Control name="razon_social"  defaultValue={formData.razon_social} onChange={(e, e2)=>{setFormData({...formData, razon_social: e2.target.value})}}/>
              </Form.Group>
              {/* Domicilio */}
              <Form.Group controlId="domicilio">
                <Form.ControlLabel>Domicilio</Form.ControlLabel>
                <Form.Control name="domicilio" defaultValue={formData.domicilio} onChange={(e, e2)=>{setFormData({...formData, domicilio: e2.target.value})}}/>
              </Form.Group>
              {/* Descripción */}
              <Form.Group controlId="descripcion">
                <Form.ControlLabel>Descripción</Form.ControlLabel>
                <Form.Control rows={3} name="descripcion" accepter={Textarea} />
              </Form.Group>
              {/* Link web */}
              <Form.Group controlId="link_web">
                <Form.ControlLabel>Link Web</Form.ControlLabel>
                <Form.Control name="link_web" />
              </Form.Group>
              {/* Link CRM */}
              <Form.Group controlId="link_CRM">
                <Form.ControlLabel>Link CRM</Form.ControlLabel>
                <Form.Control name="link_CRM" />
              </Form.Group>
            </Form>
          ) : null}

          {/* ============================= LOCALIZACIÓN =============================== */}
            
          {step === 1 ? (
            <Form fluid style={{ width: "85%", margin: "0 auto" }}>

               {/* PROVINCIA */}
               <Form.Group controlId="provincia">
                <Form.ControlLabel>Provincia</Form.ControlLabel>
                <SelectPicker id="provincia" data={provincias_select} block placeholder="Seleccione una provincia" searchable={false}  onClean={() => {setCiudadesDisabled(true); setParquesDisabled(true)}} onSelect={handleProvinciaSelect}/>
              </Form.Group>
              
              {/* CIUDAD */}
              <Form.Group controlId="ciudad">
                <Form.ControlLabel>Ciudad</Form.ControlLabel>
                <SelectPicker id="ciudad" data={provincias_select} block placeholder="Seleccione una ciudad" searchable={true} onClean={() => setParquesDisabled(true)} disabled={ciudadesDisabled} onSelect={handleCiudadSelect}/>
              </Form.Group>

              {/* PARQUES INDUSTRIALES */}
              <Form.Group controlId="parque_industrial">
                <Form.ControlLabel>Parque Industrial</Form.ControlLabel>
                <SelectPicker id="parque_industrial" data={parques} block placeholder="Seleccione un parque" searchable={false}  disabled={parquesDisabled}/>
              </Form.Group>
              
            </Form>
          ) : null}
        
        
        </Panel>
        <br />
        <ButtonGroup>
          <Button
            onClick={onPrevious}
            disabled={step === 0}
            appearance="primary"
          >
            Previous
          </Button>
          <Button onClick={onNext} disabled={step === 4} appearance="primary">
            Next
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

export default Agregar;
