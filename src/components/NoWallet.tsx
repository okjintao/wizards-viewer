import React, { useEffect, useState } from 'react';
import Image from 'next/image';

function NoWallet(): JSX.Element {
  const galleryOptions = 5;
  const [wizard, setWizard] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setWizard((wizard + 1) % galleryOptions),
      4000,
    );
    return () => clearInterval(interval);
  });

  return (
    <>
      <div className="text-5xl text-raspberry">Wizards Only</div>
      <Image
        src={`/img/gallery/${wizard}.png`}
        width={275}
        height={275}
        alt="Connection Wizard"
      />
      <div className="text-2xl text-skull">Connect your wallet to enter</div>
    </>
  );
}

export default NoWallet;
