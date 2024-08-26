import {  MDBCard, MDBCardBody, MDBContainer } from "mdb-react-ui-kit";
import { UpdatePrivacy } from "../../../components/Settings/UpdatePrivacy";

export const Settings = () => {
  

  return (
    <MDBContainer className="py-5">
      <MDBCard>
        <MDBCardBody className="p-4">
            <UpdatePrivacy/>
            
          </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};
