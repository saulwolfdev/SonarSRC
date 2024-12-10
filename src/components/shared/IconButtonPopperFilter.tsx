import { Badge, IconButton } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAltOutlined";

interface IconButtonPopperFilterProps{
    handleClick: any;
    open : boolean
}

export default function IconButtonPopperFilter({handleClick, open} : IconButtonPopperFilterProps ){
    return(
        <IconButton onClick={handleClick} sx={{ width: 50, height: 50 }}  aria-describedby={open ? "simple-popper" : undefined}>
        <Badge sx={{ width: 50, height: 50 }}>
           <FilterAltIcon sx={{color: "#000", width: 50, height: 50}} />
        </Badge>
      </IconButton>
    )
}