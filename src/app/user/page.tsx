'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

export default withPageAuthRequired(
    function Page() {
        return (
            <main>
                <p>This is user page.</p>
                <div>
                    <Link href='/'>Got to Home</Link>
                </div>
            </main>
        );
    }
)
