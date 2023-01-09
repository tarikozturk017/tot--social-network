import { Box } from "@mui/material";
import { styled } from "@mui/system";
import { Component } from "react";

// good if reusing css as a Component
const FlexBetween = styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
})

export default FlexBetween;