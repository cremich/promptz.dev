'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Github as GitHubIcon } from 'lucide-react'

const footerLinks = {
  resources: [
    { href: '/prompts', label: 'Prompts' },
    { href: '/agents', label: 'Agents' },
    { href: '/powers', label: 'Powers' },
    { href: '/steering', label: 'Steering' },
    { href: '/hooks', label: 'Hooks' },
  ],
  community: [
    { href: 'https://github.com/promptz-dev/promptz', label: 'GitHub', external: true },
    { href: 'https://github.com/promptz-dev/promptz/issues', label: 'Issues', external: true },
    { href: 'https://github.com/promptz-dev/promptz/discussions', label: 'Discussions', external: true },
  ],
  tools: [
    { href: 'https://kiro.dev', label: 'Kiro', external: true },
    { href: 'https://aws.amazon.com/q/developer/', label: 'Amazon Q Developer', external: true },
  ],
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 bg-card/30">
      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <Image
                src="/promptz_logo.png"
                alt="Promptz"
                width={24}
                height={24}
                className="rounded"
              />
              <span className="text-lg font-semibold">promptz</span>
            </Link>
            <p className="mb-4 text-sm text-muted-foreground">
              The community library for Kiro developers. Discover and share
              prompts, powers, agents, and more.
            </p>
            <a
              href="https://github.com/promptz-dev/promptz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              aria-label="View on GitHub"
            >
              <GitHubIcon className="h-4 w-4" />
              <span>Star on GitHub</span>
            </a>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Community</h3>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Tools</h3>
            <ul className="space-y-2">
              {footerLinks.tools.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Promptz. Open source under MIT License.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with ❤️ for{' '}
            <a
              href="https://kiro.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gradient font-medium hover:underline"
            >
              Kiro
            </a>{' '}
            developers
          </p>
        </div>
      </div>
    </footer>
  )
}
