import { Knex } from 'knex';
import { UserRole } from '../../src/controllers/users/users.types';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();
  await knex('contact_verifications').del();
  await knex('addresses').del();

  // Inserts seed entries
  await knex('users').insert([
    {
      email: 'user1@minhaserra.com',
      role: UserRole.BUYER,
      first_name: 'John',
      last_name: 'Doe',
      // password 'r9p6x2M9kR79oSycuxdi6CcHDXRnLkhQtUMr7ylhTyTPEC8ejEK65SuVugaMO1'
      password_hash:
        '254b5b07b0c2b8837e4c1ba24a4cbed1c370cfe49d74d867260c5f46b96eb662a7eaebffac4e917710ef4dbefcf46a74f8290777de8c8d36f2555f07ab4e62c93cebf8b9f3f52eb32708564370425b1a73f4f56e793a8d61bf0b200bde4d901c5fc718b338d1538a8ac2f059d79883f7a669ffff6b3872e12dc0ccfa1e5fe04c',
      password_salt:
        'b2d1f913e7326957b042a034e2b021efef3001b0d0477455815914778063d47a',
      password_iterations: 128,
      terms_version: 1,
    },
  ]);
}
