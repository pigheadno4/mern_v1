import { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  useGetShippingAddressesQuery,
  useSetShippingDefaultMutation,
  useGetBillingAddressesQuery,
  useSetBillingDefaultMutation,
} from "../slices/addressApiSlice";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import EditIcon from "@mui/icons-material/Edit";
import PlaceIcon from "@mui/icons-material/Place";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import AddressEditModal from "./AddressEditModal";
import CardActionArea from "@mui/material/CardActionArea";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function AddressListModal({ isShipping }) {
  const [open, setOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedCard, setSelectedCard] = useState();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isShip, setIsShip] = useState(isShipping);

  const { data: SDData, isSuccess: SDSuccess } = useGetShippingAddressesQuery();
  const [setShippingDefault] = useSetShippingDefaultMutation();

  const { data: BDData, isSuccess: BDSuccess } = useGetBillingAddressesQuery();
  const [setBillingDefault] = useSetBillingDefaultMutation();

  useEffect(() => {
    if (isShip && SDSuccess) {
      setAddresses(SDData);
    }
    if (!isShip && BDSuccess) {
      setAddresses(BDData);
    }
  }, [SDSuccess, BDSuccess, SDData, BDData, isShip]);

  const setDefaultAddress = async (id) => {
    console.log("set shipping address default: ", `${id}`);
    try {
      if (isShip) {
        await setShippingDefault(id);
      } else {
        await setBillingDefault(id);
      }
      setSelectedCard(id);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Button variant="text" size="small" onClick={handleOpen}>
        Change
        <NavigateNextIcon />
      </Button>
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
          <Box sx={style}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {addresses.map((address) => (
                <Grid size={6} key={address._id}>
                  <Card
                    variant="outlined"
                    //   className="shadow"
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <CardActionArea
                      onClick={() => setDefaultAddress(address._id)}
                      data-active={
                        address.isDefault === true ||
                        address._id === selectedCard
                          ? ""
                          : undefined
                      }
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        "&[data-active]": {
                          backgroundColor: "action.selected",
                          "&:hover": {
                            backgroundColor: "action.selectedHover",
                          },
                        },
                      }}
                    >
                      <CardContent>
                        <Typography
                          sx={{ color: "text.primary", fontSize: 16 }}
                        >
                          {address.name.surname} {address.name.given_name}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <PlaceIcon fontSize="small" />
                          <Typography variant="body2">
                            {address.address_line_1} {address.address_line_2}
                            <br />
                            {address.admin_area_1} {address.admin_area_2}{" "}
                            {address.country_code} {address.postal_code}
                            <br />
                            {address.phone_number}
                          </Typography>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                    <CardActions>
                      <AddressEditModal
                        address={address}
                        mode="Update"
                        isShipping={isShip}
                      />
                    </CardActions>
                  </Card>
                </Grid>
              ))}
              <Grid size={6}>
                <Card
                  variant="outlined"
                  //   boxShadow
                  //   className="shadow"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <CardActions>
                    {/* <Fab variant="circular" size="small"> */}
                    <Button>
                      {/* <AddIcon fontSize="small" /> */}
                      <AddressEditModal isShipping={isShip} />
                    </Button>
                    {/* </Fab> */}
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default AddressListModal;
