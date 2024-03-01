import Features from "@/components/admin/Features";
import FormWrapper from "@/components/admin/FormWrapper";
import Pagination from "@/components/admin/Pagination";
import TableRow from "@/components/table/row";
import { createUser, getAllUsers, updateUser } from "@/lib/actions/usersActions";
import User from "@/models/user";

export default async function UsersCrud({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { users, count, totalPage } = await getAllUsers(searchParams);
  let newUser = new User();
  const newUserJSON = {
    _id: newUser._id.toString(),
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    password: newUser.password,
    role: newUser.role,
  };
  return (
    <div className="w-[80%]">
      <FormWrapper updateAction={updateUser} createAction={createUser}></FormWrapper>
      <div className="flex w-full flex-col rounded-lg p-12">
        <Features newItemModel={newUserJSON} />
        <div className="flex flex-row place-content-between items-center rounded-t-lg border-x-2 border-t-2 bg-white p-2">
          <div className="ml-24 flex flex-row gap-32">
            <h1>Name</h1>
            <h1>Email</h1>
            <h1>Role</h1>
          </div>
          <div className="mr-10 flex flex-row gap-4">
            <h1>Actions</h1>
          </div>
        </div>
        {users.map((user) => (
          <TableRow item={user}></TableRow>
        ))}
      </div>
      {totalPage && <Pagination totalPage={totalPage} />}
    </div>
  );
}
