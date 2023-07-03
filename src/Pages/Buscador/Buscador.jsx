import "./Buscador.css";
import { SelectPicker, Input, InputGroup, Table, Modal} from "rsuite";
const { Column, HeaderCell, Cell } = Table;
import { useState } from "react";
import SearchIcon from '@rsuite/icons/Search';
import { useNavigate } from "react-router-dom";


const provincias = [
  "Neuquén",
  "Río Negro",
  "Tierra del Fuego",
  "Chubut",
  "Santa Cruz",
].map((item) => ({ label: item, value: item }));

const nivel = ["Nivel 1", "Nivel 2", "Nivel 3", "Nivel 4"].map((item) => ({
  label: item,
  value: item,
}));

const tabla = [{nombre: "MATRA", cuit_cuil: "1329399303", nivel_kaizen: "Nivel 1", provincia: "Neuquén", sector: "Hidrocarburos"}]



function Buscador() {

  const navigate = useNavigate()

  // ============================== FILTROS  =============================

  const [sector, setSector] = useState("") 
  const [nivelKaizen, setNivelKaizen] = useState("")
  const [provincia, setProvincia] = useState("") 
  const [valorBuscador, setValorBuscador] = useState("")

 
  // const fetchAPI =  () => {}
 

  return (
    <div className="buscador-container">
      <div className="section-title">buscador</div>

      <div className="section-subtitle">
        <p>FILTROS</p>
      </div>

      <div className="filters">
        <SelectPicker
          className="filter"
          size="lg"
          id="sector"
          placeholder="Sector al que pertenece"
          data={nivel}
          onChange={(value) => setSector(value)}
        />
        <SelectPicker
          searchable={false}
          className="filter"
          size="lg"
          id="nivel"
          placeholder="Nivel Kaizen"
          data={nivel}
          onChange={(value) => setNivelKaizen(value)}
        />
        <SelectPicker
          searchable={false}
          className="filter"
          size="lg"
          id="provincia"
          placeholder="Provincia"
          data={provincias}
          onChange={(value)=> setProvincia(value)}
        />
      </div>

      <div className="searchbar">
        <div className="search-bar-container">
          <InputGroup inside>
            <Input placeholder="Buscar por nombre o razón social" size="lg" onChange={(value)=> setValorBuscador(value)}/>
            <InputGroup.Addon>
              <SearchIcon />
            </InputGroup.Addon>
          </InputGroup>
        </div>
      </div>

      <div className="table-container">

          <Table
          fillHeight
          data={tabla}
          onRowClick={(rowData)=>{navigate(`/${rowData.nombre}`)}}
          // sortType={}
          // onSortColumn={handleSortColumn}
          // loading={loading} 
          >
                <Column flexGrow={1} align="center" fixed sortable>
                  <HeaderCell>Nombre</HeaderCell>
                  <Cell dataKey="nombre" className="data-cell"/>
                </Column>

                <Column flexGrow={1} align="center" fixed sortable>
                  <HeaderCell>CUIT/CUIL</HeaderCell>
                  <Cell dataKey="cuit_cuil" className="data-cell" />
                </Column>

                <Column flexGrow={1} align="center" sortable>
                  <HeaderCell>Sector</HeaderCell>
                  <Cell dataKey="sector" className="data-cell"/>
                </Column>

                <Column  flexGrow={1} align="center" sortable>
                  <HeaderCell>Nivel Kaizen</HeaderCell>
                  <Cell dataKey="nivel_kaizen" className="data-cell"/>
                </Column>

                <Column width={200} align="center" sortable>
                  <HeaderCell>Provincia</HeaderCell>
                  <Cell dataKey="provincia" className="data-cell"/>
                </Column>
        </Table>

      </div>


    

    </div>
  );
}

export default Buscador;
