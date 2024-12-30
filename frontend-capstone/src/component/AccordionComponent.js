import React from "react";
import {Accordion, AccordionSummary, AccordionDetails, Divider, Chip, Typography,} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

// label : 칩에 표기될 글
// name : 표시할 이름
// id: 바꿀 값의 key
// visible : 바꿀값들의 노출여부
// setVisible : visible 바꾸는 역할
// children : 하위 컴포넌트
// reversed : 아이콘 방향을 바꾸는 props
const AccordionComponents = ({label, name, id, visible, setVisible, children, style = {}, reversed}) => {
  return (
    <Accordion
      expanded={visible[id]}
      onChange={() => setVisible({ ...visible, [id]: !visible[id] })}
      sx={{ ...style.accordion }}>
      <AccordionSummary
        expandIcon={reversed ? <ExpandLess/> : <ExpandMore />}
        aria-controls={`${id}-content`}
        id={`${id}-header`}
        sx={style.accordionSummary}>
        <Typography sx={style.typography}>{name}</Typography>
      </AccordionSummary>
      <Divider sx={style.divider}>
        <Chip label={label} size="small" sx={style.chip} />
      </Divider>
      <AccordionDetails sx={style.accordionDetails}>{children}</AccordionDetails>
    </Accordion>
  );
};

export default AccordionComponents;
