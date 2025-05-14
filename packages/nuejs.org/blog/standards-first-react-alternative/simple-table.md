
---
back_to: standards-first-react-alternative/
pagehead: false
unlisted: true
---

# Simple table component

## With modern React
Modern React uses TypeScript and component libraries like ShadCN or Chakra UI. Here's ShadCN <Table> in action:


``` jsx
import React from "react";

import { User, UserTableProps } from "./UserTable.types.ts";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const UserTable: React.FC<UserTableProps> = ({ users }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Age</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user, index) => (
          <TableRow key={index}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.age}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
```

Here is the extra TypeScript needed (not included in the comparison images):

```
// UserTable.types.ts
export interface User {
  name: string;
  email: string;
  age: number;
}

export interface UserTableProps {
  users: User[];
}
```


## Old school React { #oldschool }
In the early days of React (circa 2013-2016), styling followed standard web development patterns with completely separate concerns. CSS files were loaded directly in HTML, not into the React file. A simple table component would be implemented like this:

``` jsx
import React from 'react';

class TableComponent extends React.Component {
  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {this.props.users.map(user => (
            <tr>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default TableComponent;
```


## Hyper
Clean, semantic HTML. Any attempt to hardcode styling is prohibited.

```
<table>
  <tr>
    <th>Name</th>
    <th>Email</th>
    <th>Age</th>
  </tr>
  <tr :for="user of users">
    <td>${ user.name }</td>
    <td>${ user.email }</td>
    <td>${ user.age }</td>
  </tr>
</table>
```
