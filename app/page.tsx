import { redirect } from 'next/navigation';

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function IndexPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};

  const role = first(sp.role);
  const resident = first(sp.resident);

  // Blueprint routing: simulate landing based on user profile.
  // In the functional version, this will be derived from Supabase RBAC.
  if (role === 'nurse' || role === 'caregiver') {
    if (resident) {
      redirect(
        `/shift/${encodeURIComponent(resident)}?role=${encodeURIComponent(role)}`
      );
    }

    redirect(`/shift?role=${encodeURIComponent(role)}`);
  }

  if (role === 'collaborator') {
    redirect('/schedule');
  }

  redirect('/dashboard');
}
