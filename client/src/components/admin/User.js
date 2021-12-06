const User = ({ user }) => {
  return (
    <tr>
      <th scope="row">{user.id}</th>
      <td>
        {user.firstname} {user.lastname}
      </td>
      <td>{user.email}</td>
      <td>{user.balance}</td>
    </tr>
  );
};

export default User;
