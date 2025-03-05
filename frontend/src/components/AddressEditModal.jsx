import { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid2";
import {
  useUpdateAddressMutation,
  useCreateAddressMutation,
} from "../slices/addressApiSlice";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  display: "flex",
  p: 4,
};

function AddressEditModal({ address, mode = "Create", isShipping }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [area1, setArea1] = useState("");
  const [area2, setArea2] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [givenName, setGivenName] = useState("");
  const [surname, setSurName] = useState("");

  const [updateAddress, { isLoading: updateLoading }] =
    useUpdateAddressMutation();
  const [createAddress, { isLoading: createLoading }] =
    useCreateAddressMutation();

  useEffect(() => {
    if (address) {
      setAddress1(address?.address_line_1);
      setAddress2(address?.address_line_2);
      setArea1(address?.admin_area_1);
      setArea2(address?.admin_area_2);
      setCountryCode(address?.country_code);
      setPostalCode(address?.postal_code);
      setPhoneNumber(address?.phone_number);
      setGivenName(address?.name?.given_name);
      setSurName(address?.name?.surname);
    }
  }, [address]);

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("saved!!!!!!!!");
    console.log("isShipping1: ", isShipping);
    const updatedAddress = {
      ...address,
      name: { given_name: givenName, surname },
      address_line_1: address1,
      address_line_2: address2,
      admin_area_1: area1,
      admin_area_2: area2,
      postal_code: postalCode,
      country_code: countryCode,
      phone_number: phoneNumber,
      isShipping,
    };
    console.log(updatedAddress);
    try {
      if (mode === "Create") {
        console.log("create address");
        await createAddress(updatedAddress);
        // refetch();
      } else {
        console.log("update address");
        await updateAddress(updatedAddress);
        // refetch();
      }
      handleClose();
    } catch (err) {
      console.group(err);
      throw new Error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      {/* <Fab variant="circular" size="small"> */}
      <Button onClick={handleOpen}>
        {mode === "Create" ? <AddIcon /> : <EditIcon />}
      </Button>
      {/* </Fab> */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style} component="form" onSubmit={submitHandler}>
            <Grid container spacing={2} sx={{ width: "100%" }}>
              <Grid size={12}>
                <Typography variant="h6" gutterBottom>
                  {mode === "Create" ? "Create " : "Update "} Address
                </Typography>
              </Grid>
              <Grid container spacing={2} size={12}>
                <Grid size={4}>
                  <TextField
                    label={"First Name"}
                    id="givenName"
                    value={givenName}
                    onChange={(e) => setGivenName(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid size={4}>
                  <TextField
                    label={"Last Name"}
                    id="suname"
                    value={surname}
                    onChange={(e) => setSurName(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid size={4}>
                  <TextField
                    label={"Phone"}
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    fullWidth
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">+1 </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
              </Grid>
              <TextField
                label={"Address1"}
                id="address1"
                value={address1}
                fullWidth
                onChange={(e) => setAddress1(e.target.value)}
              />
              <TextField
                label={"Address2"}
                id="address2"
                value={address2}
                fullWidth
                onChange={(e) => setAddress2(e.target.value)}
              />

              <Grid container spacing={2} size={12}>
                <Grid size={3}>
                  <TextField
                    label={"City"}
                    id="area1"
                    value={area1}
                    fullWidth
                    onChange={(e) => setArea1(e.target.value)}
                  />
                </Grid>
                <Grid size={3}>
                  <TextField
                    label={"State"}
                    id="area2"
                    value={area2}
                    fullWidth
                    onChange={(e) => setArea2(e.target.value)}
                  />
                </Grid>
                <Grid size={3}>
                  <TextField
                    label={"Zip"}
                    id="postalCode"
                    value={postalCode}
                    fullWidth
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </Grid>
                <Grid size={3}>
                  <TextField
                    label={"Country"}
                    id="countryCode"
                    value={countryCode}
                    fullWidth
                    onChange={(e) => setCountryCode(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Grid size={12} sx={{ textAlign: "center" }}>
                <Button type="submit" variant="contained" fullWidth>
                  Save
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export default AddressEditModal;
