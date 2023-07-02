import "./Empresa.css";
import { useParams } from "react-router-dom";
import { Tag, IconButton, Nav, Button } from "rsuite";
import { SiMicrosoftoutlook, SiWhatsapp } from "react-icons/si";
import { FaPeopleArrows } from "react-icons/fa";
import { ImOnedrive } from "react-icons/im";
import { useState } from "react";

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

function Empresa() {
  const { id } = useParams();
  const [active, setActive] = useState("informacion-general");

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
              <a
                href="https://intigobar.sharepoint.com/:f:/s/-SORPAT-ATGsPatagnicos/EpF4X-oNeYdGmevnRrfVpRcBp7Lc4lqUuNaOkMO4frtyTA"
                className="a_btn"
                target="_blank"
                rel="noreferrer"
              >
                <IconButton
                  className="btn-icon"
                  icon={<ImOnedrive className="icon-button" />}
                  color="blue"
                  appearance="primary"
                >
                  Carpeta ATGs Patagónicos
                </IconButton>
              </a>

              <a
                target="_blank"
                rel="noreferrer"
                className="a_btn"
                href="https://crm.inti.gob.ar/index.php?module=Accounts&offset=1&stamp=1688171761027743400&return_module=Accounts&action=DetailView&record=c604163c-0c14-d21b-b6c7-61c223215a42"
              >
                <IconButton
                  className="btn-icon"
                  icon={<FaPeopleArrows className="icon-button" />}
                  color="red"
                  appearance="primary"
                >
                  Historial CRM
                </IconButton>
              </a>
            </div>
          </div>

          {/* ================================================ CARDS DE CONTACTO ================================================= */}
          <div className="contact-info">
            <p className="header-2">INFORMACIÓN DE CONTACTO</p>

            <div className="cards-container">
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
            </div>
          </div>
        </div>
      )}

      {active === "antecedentes" && (
        <div className="antecedentes">
          <p className="header">HERRAMIENTAS</p>

          <p className="header">CARPETA DE ANTECEDENTES</p>

          <a
            target="_blank"
            rel="noreferrer"
            href="https://intigobar.sharepoint.com/:f:/s/-SORPAT-ATGsPatagnicos/EpF4X-oNeYdGmevnRrfVpRcBp7Lc4lqUuNaOkMO4frtyTA?e=h7DR0c"
            className="btn-link"
          >
            <IconButton
              className="btn-icon"
              icon={<ImOnedrive className="icon-button" />}
              color="blue"
              appearance="primary"
            >
              Carpeta ATGs Patagónicos
            </IconButton>
          </a>
        </div>
      )}
    </div>
  );
}

export default Empresa;
