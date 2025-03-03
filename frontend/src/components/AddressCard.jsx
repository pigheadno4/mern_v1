import { Box, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";

import PlaceIcon from "@mui/icons-material/Place";

import AddressEditModal from "./AddressEditModal";
import { useEffect, useState } from "react";
// import Box from "@mui/material";

function AddressCard({ address, isShipping }) {
  const [surname, setSurname] = useState("");
  const [givenName, setGivenName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [area1, setArea1] = useState("");
  const [area2, setArea2] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isShip, setIsShip] = useState(isShipping);

  useEffect(() => {
    if (address) {
      setSurname(address?.name?.surname);
      setGivenName(address?.name?.given_name);
      setAddress1(address?.address_line_1);
      setAddress2(address?.address_line_2);
      setArea1(address?.admin_area_1);
      setArea2(address?.admin_area_2);
      setCountryCode(address.country_code);
      setPostalCode(address.postal_code);
      setPhoneNumber(address.phone_number);
    }
  }, [address]);

  if (!address)
    return (
      <Card
        variant="outlined"
        className="shadow"
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <CardActions>
          {/* <Button onClick={() => showModal(true)}>
            <AddIcon fontSize="small" />
          </Button> */}
          <AddressEditModal isShipping={isShip} />
        </CardActions>
      </Card>
    );
  let content = (
    <Card
      variant="outlined"
      //   className="shadow"
      sx={{ display: "flex", justifyContent: "space-between" }}
    >
      <CardContent>
        <Typography sx={{ color: "text.primary", fontSize: 16 }}>
          {surname} {givenName}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <PlaceIcon fontSize="small" />
          <Typography variant="body2">
            {address1} {address2}
            <br />
            {area1} {area2} {countryCode} {postalCode}
            <br />
            {phoneNumber}
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        {/* <Fab variant="circular" size="small"> */}
        {/* <Button onClick={() => showModal(true)}>
          <EditIcon fontSize="small" />
        </Button> */}
        <AddressEditModal address={address} mode="Update" isShipping={isShip} />
        {/* </Fab> */}
      </CardActions>
    </Card>
  );
  return content;
}

export default AddressCard;
