"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Header } from "../../../components";

export default function Home() {
  const { data: session } = useSession();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Leer el mensaje desde localStorage
    const flashMessage = localStorage.getItem("flashMessage");
    
    if (flashMessage) {
      setMessage(flashMessage);
      // Eliminar el mensaje después de mostrarlo
      localStorage.removeItem("flashMessage");
    }
  }, []);

  return (
    <div>
      <Header />
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES
        </h1>

        {/* 1 */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6">
          <p className="text-justify text-gray-700">
            La Ley 1581 de 2012, reglamentada parcialmente por el Decreto 1377 de 2013, tiene por objeto desarrollar el derecho constitucional que tienen todas las personas a conocer, actualizar y rectificar 
            las informaciones que se hayan recogido sobre ellas en bases de datos o archivos, y, los demás derechos, libertades y garantías constitucionales de que trata el artículo 15 de la Constitución Política, 
            así como el derecho a la información consagrado en el artículo 20 de la misma Carta.<br></br>
            Dando cumplimiento a lo establecido por la Ley 1581 de 2012, por la cual se dictan disposiciones para la protección de datos personales, Guayaba, en su calidad de responsable del tratamiento de datos personales
            , formula las políticas generales que deben seguirse:
          </p>
        </div>

        {/* 1.1 */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            1.1 Identificación del Responsable del Tratamiento de Datos Personales
          </h1>
          <p className="text-justify text-gray-700">
            El Responsable del Tratamiento de Datos Personales es Santiago Reyes Ochoa, identificado con C.C 1025460191 con correo electrónico: sreyeso@unal.edu.co.
            <br></br>
            <br></br>
            Contacto: A través de cualquiera de los siguientes canales de Atención al cliente que Santiago Reyes Ochoa tiene dispuestos:
            <br></br>
            • Escrito: Calle 75 # 92-30 en Bogotá. Correo Electrónico: guayabagestion@gmail.com<br></br>
            • Celular: +57 314 8073225<br></br>
            <br></br>
            Es encargado del tratamiento de los datos personales Santiago Reyes Ochoa, según el tipo de información que maneja en el cumplimiento de sus funciones.
          </p>
        </div>

        {/* 2 */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            2. Objetivo
          </h1>
          <p className="text-justify text-gray-700">
          Establecer la política para el tratamiento de datos de Guayaba para la debida protección de los derechos de los usuarios que suministran sus datos personales a la entidad por las diferentes vías de atención y los diferentes medios de recolección de información.<br></br>
          La política de tratamiento de datos que presenta este documento hace parte integral de la política de seguridad y privacidad de la información.
          </p>
        </div>


        {/* 3 */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            3. Alcance
          </h1>
          <p className="text-justify text-gray-700">
            Esta política de protección de datos aplica a todos los servidores públicos colaboradores, proveedores y personal externo que tenga acceso a los datos personales recogidos por Guayaba. Igualmente aplica a toda la información determinada como dato personal que se encuentre registrada en bases de datos, archivos de información o cualquier medio de almacenamiento en poder de Guayaba y que por sus características particulares haya sido contemplada en la Ley 1581 de 2012.
          </p>
        </div>

        {/* 4 */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            4. Obligaciones
          </h1>
          <p className="text-justify text-gray-700">
            Todos los funcionarios, contratistas, personal que labore con Guayaba, vinculado con proveedores, o personal externo de la Entidad, que por sus labores recolecten, almacenen, usen, circulen o supriman datos cuyo encargado de tratamiento sea Santiago Reyes Ochoa, deberán conocer y dar cumplimiento a la presente política.
          </p>
        </div>

        {/* 5 */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            5. Definiciones
          </h1>
          <p className="text-justify text-gray-700">
          Para efectos de la aplicación de la presente política, se tendrán en cuenta las definiciones establecidas en el artículo 3 de la Ley 1581 de 2012, el artículo 3 del Decreto 1377 de 2013, en el artículo 3 de la Ley 1266 de 2008, o el que haga sus veces:
          <br></br><br></br>
            a. <strong>Autorización:</strong> Consentimiento previo, expreso e informado del Titular para llevar a cabo el Tratamiento de datos personales.
          <br></br><br></br>
            b. <strong>Aviso de Privacidad:</strong> Comunicación verbal o escrita generada por el responsable, dirigida al titular para el tratamiento de sus datos personales, mediante la cual se le informa acerca de la existencia de las políticas de tratamiento de información que le serán aplicables, la forma de acceder a las mismas y las finalidades del tratamiento que se pretende dar a los datos personales.
          <br></br><br></br>
            c. <strong>Base de Datos:</strong> Conjunto organizado de datos personales que sea objeto de Tratamiento.
          <br></br><br></br>
            d. <strong>Dato Personal:</strong> Cualquier información vinculada o que pueda asociarse a una o varias personas naturales determinadas o determinables.
          <br></br><br></br>
            e. <strong>Dato Público:</strong> Es el dato calificado como tal según los mandatos de la Ley o de la Constitución Política y todos aquellos que no sean semiprivados o privados, de conformidad con la Ley 1266 de 2008. Son públicos, entre otros, los datos contenidos en documentos públicos, sentencias judiciales debidamente ejecutoriadas que no estén sometidos a reserva y los relativos al estado civil de las personas.
          <br></br><br></br>
            La ley 1581 de 2012 establece las siguientes categorías especiales de datos personales:
          <br></br><br></br>
            f. <strong>Datos sensibles:</strong> Son aquellos que afectan la intimidad del Titular o cuyo uso indebido puede generar su discriminación, tales como aquellos que revelen el origen racial o étnico, la orientación política, las convicciones religiosas o filosóficas, la pertenencia a sindicatos, organizaciones sociales, de derechos humanos o que promueva intereses de cualquier partido político o que garanticen los derechos y garantías de partidos políticos de oposición, así como los datos relativos a la salud, a la vida sexual y los datos biométricos.
          <br></br><br></br>
            g. <strong>Datos personales de los niños, niñas y adolescentes:</strong> Se debe tener en cuenta que aunque la Ley 1581 de 2012 prohíbe el tratamiento de los datos personales de los niños, niñas y adolescentes, salvo aquellos que por su naturaleza son públicos, la Corte Constitucional precisó en la Sentencia C-748/11 que independientemente de la naturaleza del dato, se puede realizar el tratamiento de éstos “siempre y cuando el fin que se persiga con dicho tratamiento responda al interés superior de los niños, niñas y adolescentes y se asegure sin excepción alguna el respeto a sus derechos prevalentes”.
          <br></br><br></br>
            h. <strong>Encargado del Tratamiento:</strong> Persona natural o jurídica, pública o privada, que por sí misma o en asocio con otros, realice el Tratamiento de datos personales por cuenta del Responsable del Tratamiento.
          <br></br><br></br>
            i. <strong>Responsable de Tratamiento:</strong> Persona natural o jurídica, pública o privada, que por sí misma o en asocio con otros, decida sobre la base de datos y/o el Tratamiento de los datos.
          <br></br><br></br>
            j. <strong>Titular:</strong> Persona natural cuyos datos personales sean objeto de Tratamiento.
          <br></br><br></br>
            k. <strong>Tratamiento:</strong> Cualquier operación o conjunto de operaciones sobre datos personales, tales como la recolección, almacenamiento, uso, circulación o supresión.
          <br></br><br></br>
            l. <strong>Transferencia:</strong> La transferencia de datos tiene lugar cuando el responsable y/o encargado del tratamiento de datos personales, ubicado en Colombia, envía la información o los datos personales a un receptor, que a su vez es responsable del tratamiento y se encuentra dentro o fuera del país.
          <br></br><br></br>
            m. <strong>Transmisión:</strong> Tratamiento de datos personales que implica la comunicación de los mismos dentro o fuera del territorio de la Republica de Colombia cuando tenga por objeto la realización de un tratamiento por el encargado por cuenta del responsable.
          </p>
        </div>

        {/* 6 */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            6. Principios generales para tratamiento de datos personales
          </h1>
          <p className="text-justify text-gray-700">
          En aplicación de la Ley 1581 de 2012 y las normas que la complementan, modifican o adicionan, Guayaba, aplicará de manera armónica e integral los principios establecidos en el artículo 4º de la Ley 1581 de 2012. <br></br><br></br>
            <strong>Principio de legalidad:</strong> La recolección, uso y tratamiento de datos personales se fundamentará en lo establecido por la Ley y las demás disposiciones que la desarrollen.
          <br></br><br></br>
            <strong>Principio de finalidad:</strong> La recolección, uso y tratamiento de datos personales obedecerán a una finalidad legítima de acuerdo con la Constitución y la Ley, la cual será informada al titular de los datos.
          <br></br><br></br>
            <strong>Principio de libertad:</strong> La recolección, uso y tratamiento de datos personales sólo puede ejercerse con el consentimiento previo, expreso e informado del titular. Los datos personales no podrán ser obtenidos o divulgados sin previa autorización, o en ausencia de mandato legal o judicial que releve el consentimiento.
          <br></br><br></br>
            <strong>Principio de veracidad o calidad:</strong> La información sujeta a tratamiento debe ser veraz, completa, exacta, actualizada, comprobable y comprensible. Se prohíbe el tratamiento de datos parciales, incompletos, fraccionados o que induzcan a error.
          <br></br><br></br>
            <strong>Principio de transparencia:</strong> En la recolección, uso y tratamiento de datos personales debe garantizarse el derecho del titular a obtener del responsable del tratamiento o del encargado, en cualquier momento y sin restricciones, información acerca de la existencia de datos que le conciernan.
          <br></br><br></br>
            <strong>Principio de acceso y circulación restringida:</strong> La recolección, uso y tratamiento de datos sólo podrá hacerse por personas autorizadas por el titular y/o por las personas previstas en la Ley y demás normas que la desarrollan.
          <br></br><br></br>
            Los datos personales, salvo la información pública, no podrán estar disponibles en Internet u otros medios de divulgación o comunicación masiva, salvo que el acceso sea técnicamente controlable para brindar un conocimiento restringido sólo a los titulares o terceros autorizados conforme a la ley.
          <br></br><br></br>
            <strong>Principio de seguridad:</strong> Los datos personales e información sujeta a tratamiento público, será objeto de protección y deberá manejarse con las medidas y recursos técnicos, humanos y administrativos que sean necesarios para brindar seguridad a los registros, así como con la adopción de herramientas tecnológicas de protección, evitando su adulteración, pérdida, consulta, uso o acceso no autorizado o fraudulento.
          <br></br><br></br>
            <strong>Principio de confidencialidad:</strong> Todas las personas que intervengan en la recolección, uso y tratamiento de datos personales que no tengan la naturaleza de públicos están obligadas a garantizar la reserva de la información, incluso luego de finalizada su relación con alguna de las labores que comprende el tratamiento.
          </p>
        </div>

        {/* 7 */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            7. Tratamiento de datos personales
          </h1>
          <p className="text-justify text-gray-700">
          El usuario, visitante, ciudadano y toda persona que suministra sus datos personales a Guayaba, por cualquier medio, lo hace voluntariamente y por la necesidad de obtener un servicio de la entidad, o presentar una queja o reclamo, o acceder a los sitios o aplicativos web. Lo anterior significa que Guayaba podrá capturar sus datos personales.
          <br></br><br></br>
          En este sentido, los datos personales que recolecta, almacena, usa o suprime Guayaba en sus bases de datos, se utilizarán única y exclusivamente para el cumplimiento de sus funciones y no serán cedidos a terceros para fines distintos, sin la debida autorización del titular de la información.
          <br></br><br></br>
          En todo caso, para el almacenamiento y uso de la información personal, Guayaba se regirá por lo dispuesto en la Ley 1581 de 2012 y el Decreto 1377 de 2013, o las que hagan sus veces, teniendo en cuenta que toda persona tiene derecho a conocer, rectificar y actualizar la información que la Entidad registre en las bases de datos o archivos susceptibles de tratamiento.
          <br></br><br></br>
          En general, el tratamiento de los datos sensibles que sean recolectados por Guayaba, se hará de conformidad con lo establecido en el título III de la Ley 1581 de 2012 y las demás normas que la desarrollen o complemente.
          </p>
        </div>

        {/* 8 */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            8. Personas a quienes Guayaba puede suministrar la información
          </h1>
          <p className="text-justify text-gray-700">
            La información y datos personales que reúnan las condiciones establecidas por la ley y las demás normas que la desarrollan, siguiendo lo establecido en esta política, podrán suministrarse a las siguientes personas:
            <br></br><br></br>
            •	A los titulares o sus representantes legales.
            <br></br><br></br>
            •	A las entidades públicas o administrativas en ejercicio de sus funciones legales o por orden judicial.
            <br></br><br></br>
            •	A los terceros autorizados por el titular o por la ley.
          </p>
        </div>

        {/* 9 */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            9. Tratamiento y finalidad
          </h1>
          <p className="text-justify text-gray-700">
            El tratamiento que realizará Santiago Reyes Ochoa como responsable del tratamiento de datos personales con la información personal será el siguiente: 
            <br></br><br></br>
            •	Recopilar información de asistentes a eventos, cursos, capacitaciones y cualquier otra actividad desarrollada por la Agencia o en las que ésta participe.
            <br></br><br></br>
            •	Atender y evaluar la satisfacción de los usuarios frente a las peticiones, quejas, reclamos y denuncias presentadas.
            <br></br><br></br>
            La recolección, almacenamiento, uso, circulación, supresión, actualización y gestión de los datos personales capturados por Guayaba, se realizará en ejercicio de sus funciones legales. 
          </p>
        </div>

        {/* 10 */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            10. Derechos de los titulares de los datos personales
          </h1>
          <p className="text-justify text-gray-700">
            Guayaba, garantiza al titular de datos personales, el pleno de ejercicio de los derechos contenidos en el artículo 8º de la Ley 1581 de 2012, a saber: 
            <br></br><br></br>
            a. Conocer, actualizar y rectificar sus datos personales frente a los Responsables del Tratamiento o Encargados del Tratamiento. 
            Este derecho se podrá ejercer, entre otros frente a datos parciales, inexactos, incompletos, fraccionados, que induzcan a error, o aquellos cuyo Tratamiento esté expresamente prohibido o no haya sido autorizado.
            <br></br><br></br>
            b. Solicitar prueba de la autorización otorgada al Responsable del Tratamiento salvo cuando expresamente se exceptúe como requisito para el Tratamiento, de conformidad con lo previsto en el artículo 10 de la citada ley.
            <br></br><br></br>
            c. Ser informado por el Responsable del Tratamiento o el Encargado del Tratamiento, previa solicitud, respecto del uso que le ha dado a sus datos personales.
            <br></br><br></br>
            d. Presentar ante la Superintendencia de Industria y Comercio quejas por infracciones a lo dispuesto en la citada ley y las demás normas que la modifiquen, adicionen o complementen.
            <br></br><br></br>
            e. Revocar la autorización y/o solicitar la supresión del dato cuando en el Tratamiento no se respeten los principios, derechos y garantías constitucionales y legales. 
            La revocatoria y/o supresión procederá cuando la Superintendencia de Industria y Comercio haya determinado que en el Tratamiento el Responsable o Encargado han incurrido en conductas contrarias a la ley y a la Constitución.
            <br></br><br></br>
            f. Acceder en forma gratuita a sus datos personales que hayan sido objeto de Tratamiento. 
          </p>
        </div>

      {/* 11 */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            11. Deberes del responsable del tratamiento
          </h1>
          <p className="text-justify text-gray-700">
            Santiago Reyes Ochoa, actuando en calidad de responsable del tratamiento de datos personales y, en consecuencia, todas sus dependencias y áreas de trabajo, como encargado del tratamiento de los datos personales, 
            cumplirá los deberes establecidos en el artículo 17º de la Ley 1581 de 2012 a saber:
            <br></br><br></br>
            a. Garantizar al Titular, en todo tiempo, el pleno y efectivo ejercicio del derecho de hábeas data.
            <br></br><br></br>
            b. Solicitar y conservar, en las condiciones previstas en la Ley 1581 de 2012, copia de la respectiva autorización otorgada por el titular, para el uso y tratamiento de los datos personales.
            <br></br><br></br>
            c. Informar debidamente al Titular sobre la finalidad de la recolección y los derechos que le asisten por virtud de la autorización otorgada.
            <br></br><br></br>
            d. Conservar la información bajo las condiciones de seguridad necesarias para impedir su adulteración, pérdida, consulta, uso o acceso no autorizado o fraudulento.
            <br></br><br></br>
            e. Garantizar que la información que se suministre al encargado del Tratamiento sea veraz, completa, exacta, actualizada, comprobable y comprensible.
            <br></br><br></br>
            f. Actualizar la información, comunicando de forma oportuna al encargado del tratamiento, todas las novedades respecto de los datos que previamente le haya suministrado y 
            adoptar las demás medidas necesarias para que la información suministrada a éste, se mantenga actualizada.
            <br></br><br></br>
            g. Rectificar la información cuando sea incorrecta y comunicar lo pertinente al encargado del tratamiento.
            <br></br><br></br>
            h. Suministrar al encargado del tratamiento, según el caso, únicamente datos cuyo tratamiento esté previamente autorizado.
            <br></br><br></br>
            i. Exigir al encargado del tratamiento en todo momento, el respeto a las condiciones de seguridad y privacidad de la información del titular.
            <br></br><br></br>
            j. Tramitar las consultas y reclamos formulados.
            <br></br><br></br>
            k. Adoptar un manual interno de políticas y procedimientos para garantizar el adecuado cumplimiento de la citada ley y en especial, para la atención de consultas y reclamos.
            <br></br><br></br>
            l. Informar a solicitud del titular sobre el uso dado a sus datos.
            <br></br><br></br>
            m. Informar a la autoridad de protección de datos cuando se presenten violaciones a los códigos de seguridad y existan riesgos en la administración de la información de los titulares.
            <br></br><br></br>
            n. Cumplir las instrucciones y requerimientos que imparta la Superintendencia de Industria y Comercio y la Procuraduría General de la Nación.
          </p>
        </div>


        {/* 12 */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            12. Aviso de Privacidad
          </h1>
          <p className="text-justify text-gray-700">
            Cuando no sea posible poner a disposición del titular, la Política de Tratamiento de la Información, Guayaba, informará por medio de un Aviso de Privacidad, sobre la existencia de tal política.
            <br></br><br></br>
            El Aviso de Privacidad se expedirá en medios físicos, electrónicos o en cualquier otro formato, donde se ponga a disposición del titular de los datos, además de la existencia de la política de tratamiento de datos, 
            la forma de acceder a ellas y la finalidad que se pretende dar a la información; el aviso se enviará al correo electrónico o dirección física cuando se disponga de dicha información.
            <br></br><br></br>
            <strong>13.1 Contenido del Aviso de Privacidad</strong><br></br>
            •	Nombre o razón social y datos de contacto del responsable del tratamiento.
            <br></br>
            •	El tratamiento al cual serán sometidos los datos y la finalidad del mismo.
            <br></br>
            •	Los derechos que le asisten al titular.
            <br></br>
            •	Los mecanismos dispuestos por la entidad para que el titular conozca la Política de Tratamiento de Datos Personales y los cambios sustanciales que se produzcan en ella o en el Aviso de Privacidad.
            <br></br>
            •	Información sobre consulta y acceso a la Política de tratamiento de Datos Personales.
          </p>
        </div>

        {/* 13 */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            13. Autorización
          </h1>
          <p className="text-justify text-gray-700">
            Guayaba, deberá obtener la autorización del titular de los datos, por medio de un documento físico, electrónico, mensaje de datos, internet, sitio web, de manera verbal, telefónica o 
            cualquier otro formato que permita su posterior consulta a fin de validar de forma inequívoca que sin el consentimiento del titular los datos no hubieran sido empleados para dichos fines.
            <br></br><br></br>
            Cada vez que un usuario se registra en los sitios y/o aplicativos web de Guayaba, tal registro se considera como una aceptación tácita de ésta política, 
            por medio de la cual autoriza a la entidad para que lleve a cabo el tratamiento de los datos personales.
          </p>
        </div>

        {/* 14 */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            14. Atención de consultas
          </h1>
          <p className="text-justify text-gray-700">
            Guayaba dará aplicación al artículo 14 de la Ley 1581 de 2012, así:
            <br></br><br></br>
            Los titulares, o sus representantes podrán consultar la información personal del titular que repose en Guayaba, quien suministrara toda la información contenida en el registro individual o que esté vinculada con la identificación del titular.
            <br></br><br></br>
            La consulta se formulará a través del correo guayabagestion@gmail.com y será atendida en un término máximo de diez (10) días hábiles, contados a partir de la fecha de recibo de la misma. 
            De cumplirse el término sin que sea posible atender la consulta, Santiago Reyes Ochoa, como responsable del tratamiento de los datos, informará al interesado, 
            expresando los motivos de la demora y señalando la fecha en que se atenderá su consulta, la cual no podrá superar los cinco (5) días hábiles siguientes al vencimiento del primer término.
          </p>
        </div>

        {/* 15 */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            15. Atención de reclamos
          </h1>
          <p className="text-justify text-gray-700">
            El Titular o sus representantes, que consideren que la información contenida en una base de datos bajo la responsabilidad de Guayaba, 
            debe ser objeto de corrección, actualización o supresión, o cuando adviertan el presunto incumplimiento de cualquiera de los deberes contenidos en ley, 
            podrán presentar un reclamo ante el Responsable del Tratamiento o el Encargado del Tratamiento el cual será tramitado bajo las reglas establecidas en el artículo 15 de la Ley 1581 de 2012, a saber:
            <br></br><br></br>
            1. El reclamo se formulará mediante solicitud dirigida al Responsable del Tratamiento o al Encargado del Tratamiento, con la identificación del Titular, 
            la descripción de los hechos que dan lugar al reclamo, la dirección, y acompañando los documentos que se quiera hacer valer. Si el reclamo resulta incompleto, 
            se requerirá al interesado dentro de los cinco (5) días siguientes a la recepción del reclamo para que subsane las fallas. 
            Transcurridos dos (2) meses desde la fecha del requerimiento, sin que el solicitante presente la información requerida, se entenderá que ha desistido del reclamo. 
            <br></br>
            En caso de que quien reciba el reclamo no sea competente para resolverlo, dará traslado a quien corresponda en un término máximo de dos (2) días hábiles e informará de la situación al interesado.
            <br></br><br></br>
            2. Una vez recibido el reclamo completo, se incluirá en la base de datos una leyenda que diga "reclamo en trámite" y el motivo del mismo, en un término no mayor a dos (2) días hábiles. 
            Dicha leyenda deberá mantenerse hasta que el reclamo sea decidido.
            <br></br><br></br>
            3. El término máximo para atender el reclamo será de quince (15) días hábiles contados a partir del día siguiente a la fecha de su recibo. 
            Cuando no fuere posible atender el reclamo dentro de dicho término, se informará al interesado los motivos de la demora y la fecha en que se atenderá su reclamo, 
            la cual en ningún caso podrá superar los ocho (8) días hábiles siguientes al vencimiento del primer término.
          </p>
        </div>

        {/* 16  TODO: Aviso privacidad*/}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          16. Derecho de acceso a los datos
          </h1>
          <p className="text-justify text-gray-700">
            Guayaba, garantiza el derecho de acceso a los datos personales, una vez se haya verificado la identidad del titular, su causahabiente y/o representante, poniendo a disposición de este, los respectivos datos personales.
            <br></br><br></br>
            Para tal efecto, se garantiza el establecimiento de medios y mecanismos electrónicos y con disponibilidad permanente, 
            que permitan el acceso del titular a los datos personales.
          </p>
        </div>

        {/* 17 */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          17. Procedimiento para el ejercicio de los derechos
          </h1>
          <p className="text-justify text-gray-700">
            Santiago Reyes Ochoa, como responsable del tratamiento de los datos, de acuerdo con las solicitudes que reciba de los Titulares de los datos, 
            estudiara la necesidad de rectificar, actualizar y suprimir, la información que resulte ser incompleta o inexacta de conformidad con el procedimiento y 
            los términos señalados en esta política, para lo cual allegará la solicitud al correo electrónico guayabagestion@gmail.com indicando la actualización, rectificación y supresión del dato y aportará la documentación que soporte su petición.
            <br></br><br></br>
            Los titulares de la información personal podrán ejercer sus derechos (revocar la autorización otorgada para el tratamiento de sus datos personales o actualizar, rectificar o suprimir alguno de ellos) en cualquier momento,
            a través de los siguientes mecanismos:
            <br></br><br></br>
            •	Correo electrónico: guayabagestion@gmail.com
            <br></br>
            •	Teléfono: 57 314 8073225
            <br></br><br></br>
            En todo caso de deberá dar cumplimiento a lo establecido en el artículo 15 de la Ley 1581 de 2012.
            <br></br><br></br>
            Los titulares de los datos personales pueden revocar el consentimiento al tratamiento de sus datos personales en cualquier momento, siempre y cuando no lo impida una disposición legal o contractual, 
            mediante la presentación de un reclamo, de acuerdo con lo establecido en el art. 15 de la ley 1581 de 2012. Para ello Guayaba pondrá a disposición del titular el correo electrónico guayabagestion@gmail.com
            </p>
        </div>

        {/* 18 */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          18. Seguridad
          </h1>
          <p className="text-justify text-gray-700">
            Guayaba, está comprometida en efectuar un correcto uso y tratamiento de los datos personales contenidos en sus bases de datos, evitando el acceso no autorizado a terceros que puedan conocer, 
            adulterar, divulgar y/o destruir la información que allí reposa.
          </p>
        </div>

        {/* 19 */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          19. Vigencia y aviso de posible cambio sustacial en las politicas de tratamiento
          </h1>
          <p className="text-justify text-gray-700">
          La presente Política para el Tratamiento de Datos Personales rige a partir de la fecha de su expedición, se divulgará a través del portal institucional; https://guayaba-frontend.vercel.app/, 
          y estará sujeta a actualizaciones en la medida en que se modifiquen o se dicten nuevas disposiciones legales sobre la materia. Así mismo, la entidad podrá modificarla a su libre elección y en cualquier momento.
          <br></br><br></br>
          Todos los cambios, modificaciones y actualizaciones que se lleven a cabo, entrarán en vigencia una vez sean publicados en el portal institucional. 
          <br></br><br></br>
          Cada vez que un usuario acceda a los sitios y/o aplicativos web de la entidad, será considerado como una aceptación tácita de esta política y cualquiera de las modificaciones que se le hagan. 
          <br></br><br></br>
          La vigencia y conservación de las bases de datos de la entidad será por un término indefinido, sin perjuicio de lo establecido en las disposiciones legales.
          </p>
        </div>

        {/* 20 */}
       <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          20. Ley aplicable y jurisdicción
          </h1>
          <p className="text-justify text-gray-700">
          La presente política se regirá por las leyes de la República de Colombia y las demás disposiciones vigentes sobre la materia.
          <br></br><br></br>
          El usuario no podrá exigir ante la entidad o ante una autoridad judicial o administrativa, la aplicación de condición, norma o convenio que no esté expresamente incorporado en la presente política.
          <br></br><br></br>
          En caso de que alguna de las disposiciones de esta política pierda vigencia u obligatoriedad, las demás disposiciones se mantendrán vigentes, serán vinculantes y producirán efectos.
          <br></br><br></br>
          La competencia para dirimir los conflictos legales o judiciales recaerá en los jueces competentes en Colombia. 
          </p>
        </div>
      </div>
    </div>
  );
}
