import Image from "next/image"
import Link from "next/link"
import {dark} from "@clerk/themes"
import { OrganizationSwitcher, SignedIn, SignOutButton } from "@clerk/nextjs";


function Topbar(){
    return (
        <nav className="topbar">
            <Link href="/" className="flex items-center gap-4">
                <Image src="/svgs/edit.svg" alt="log" width={28} height={28} />
                <p className="text-heading3-bold text-light-1 max-xs:hidden">Threds</p>
            </Link>

            <div className='flex items-center gap-1'>
                <div className='block md:hidden'>
                <SignedIn>
                    <SignOutButton>
                    <div className='flex cursor-pointer'>
                        <Image
                        src='/svgs/logout.svg'
                        alt='logout'
                        width={24}
                        height={24}
                        />
                    </div>
                    </SignOutButton>
                </SignedIn>

                </div>
                <OrganizationSwitcher  appearance={{elements:{organizationSwitcherTrigger:"py-2 px-4"},baseTheme:dark}}/>
            </div>
        </nav>
    )
}

export default Topbar