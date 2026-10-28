import type { SupportCase } from "@/types/supportCase";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


export function TicketTable({ tickets }: { tickets: SupportCase[] }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Subject</TableCell>
            <TableCell align="right">Customer</TableCell>
            <TableCell align="right">Priority</TableCell>
            <TableCell align="right">Agent</TableCell>
            <TableCell align="right">Updated</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.subject}
              </TableCell>
              <TableCell align="right">{row.customer}</TableCell>
              <TableCell align="right">{}</TableCell>
              <TableCell align="right">{}</TableCell>
              <TableCell align="right">{}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}