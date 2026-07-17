import { User } from "./sample/Model/User";
import { DbContext } from "./sample/dbcontext/DatabaseContext";

  const db = new DbContext();

  const user5 = new User('6600', 'Alice', 'alice@example.com','Role');

  // user5.updateEmail("heioveii");

   const user7 = new User('3300673', 'Alice', 'alice@example.com','Role');
   db.users.add(user7);
  // db.users.add(user4);

  await db.saveChanges();

  // db.users.remove(user6);
  // await db.users.update(user5);
  await db.saveChanges();

 let user = await db.users.toArray()


 let person = await db.users.findById('3300663');


  // const users = await db.users.toArray();
  // console.log(user);
  console.log(person);