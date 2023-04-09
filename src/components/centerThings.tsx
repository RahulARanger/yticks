import Box from "@mui/material/Box";
import { Component, ReactNode} from "react";
import Stack from "@mui/material/Stack";



interface PropsForCenterThings {
	width?: string;
    children?: ReactNode
}

export class CenterThings extends Component<PropsForCenterThings> {
	render(): ReactNode {
        const {children} = this.props;
        
		return (
			<Stack
				direction="row"
				justifyContent="center"
				alignItems="center"
				style={{ minHeight: "100vh" }}
			>
				<Box
					sx={{
						maxWidth: 350,
						minWidth: 250,
						width: this.props.width,
						height: "25vh",
					}}
				>
                    {children}
				</Box>
			</Stack>
		);
	}
}