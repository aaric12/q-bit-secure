"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PrivacyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAccept: () => void
}

export function PrivacyDialog({ open, onOpenChange, onAccept }: PrivacyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
          <DialogDescription>Please read our privacy policy carefully before using QBit Secure.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4 text-sm">
            <h3 className="text-lg font-semibold">1. Introduction</h3>
            <p>
              QBit Secure ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when you use our quantum security platform.
            </p>

            <h3 className="text-lg font-semibold">2. Information We Collect</h3>
            <p>We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Account information (name, email address, organization)</li>
              <li>Authentication credentials</li>
              <li>Network configuration data</li>
              <li>Security preferences and settings</li>
              <li>Communication data (support requests, feedback)</li>
            </ul>
            <p>We also automatically collect certain information when you use our platform:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Usage data (features accessed, actions performed)</li>
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Performance data (error reports, analytics)</li>
            </ul>

            <h3 className="text-lg font-semibold">3. How We Use Your Information</h3>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide, maintain, and improve our quantum security services</li>
              <li>Process and complete transactions</li>
              <li>Send administrative information, such as updates, security alerts, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
              <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
              <li>Personalize and improve your experience</li>
            </ul>

            <h3 className="text-lg font-semibold">4. Data Security</h3>
            <p>
              We implement appropriate technical and organizational measures to protect the security of your personal
              information. However, please be aware that no security system is impenetrable and we cannot guarantee the
              absolute security of your data.
            </p>
            <p>
              Our quantum encryption technology is designed to provide the highest level of security for your data
              transmissions, but the security of your account information also depends on maintaining the
              confidentiality of your authentication credentials.
            </p>

            <h3 className="text-lg font-semibold">5. Data Sharing and Disclosure</h3>
            <p>
              We do not sell your personal information. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>With service providers who perform services on our behalf</li>
              <li>To comply with legal obligations</li>
              <li>To protect and defend our rights and property</li>
              <li>With your consent or at your direction</li>
            </ul>

            <h3 className="text-lg font-semibold">6. Your Rights and Choices</h3>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate or incomplete information</li>
              <li>Deletion of your personal information</li>
              <li>Restriction or objection to processing</li>
              <li>Data portability</li>
              <li>Withdrawal of consent</li>
            </ul>

            <h3 className="text-lg font-semibold">7. Changes to This Privacy Policy</h3>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last Updated" date.
            </p>

            <h3 className="text-lg font-semibold">8. Contact Us</h3>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p className="font-medium">privacy@qbitsecure.com</p>

            <p className="text-muted-foreground">Last Updated: March 19, 2025</p>
          </div>
        </ScrollArea>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Decline
          </Button>
          <Button onClick={onAccept}>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
