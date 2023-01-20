import { Button, Container, Paper } from "@mui/material";
import * as React from "react";
import { useEffect } from "react";
import { useUser } from "src/redux/features/users/hooks";
import { ProfileTextField } from "./ProfileTextField";

export default function ProfilePage() {
  const currentUser = useUser();
  const [editMode, setEditMode] = React.useState<boolean>(false);
  const [firstName, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [defaultCurrency, setDefaultCurrency] = React.useState<string>("");

  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.first_name || "");
      setLastName(currentUser.last_name || "");
      setDefaultCurrency(currentUser.default_currency_code || "");
    }
  }, [currentUser]);

  if (currentUser == null) return <h1>Loading...</h1>;

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={4} sx={{ marginTop: "15px", padding: "15px" }}>
        <ProfileTextField
          name={"firstName"}
          label={"First Name"}
          value={firstName}
          setValue={setFirstName}
          isDisabled={!editMode}
        />
        <ProfileTextField
          name={"lastName"}
          label={"Last Name"}
          value={lastName}
          setValue={setLastName}
          isDisabled={!editMode}
        />
        <ProfileTextField
          name={"defaultCurrency"}
          label={"Default Currency"}
          value={defaultCurrency}
          setValue={setDefaultCurrency}
          isDisabled={!editMode}
        />
        {!editMode && <Button onClick={() => setEditMode(!editMode)}>Edit Profile</Button>}
      </Paper>
    </Container>
  );
}
