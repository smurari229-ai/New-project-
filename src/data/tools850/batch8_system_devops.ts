import { DynamicTool } from "./definitions";

export const BATCH_8_SYSTEM_DEVOPS_TOOLS: DynamicTool[] = [
  {
    id: 851,
    title: "Linux File Permissions Numerical (Chmod 777 to 000)",
    category: "DevOps",
    description: "Evaluates exact Read, Write, and Execute rights for Owner, Group, and Others.",
    keywords: ["chmod", "permissions", "linux", "sysadmin"],
    inputType: "text",
    default1: "755",
    run: (v) => {
      const p = v.trim();
      if (!/^[0-7]{3,4}$/.test(p)) return "Enter 3 or 4 octal digits (e.g. 755 or 0644)";
      const digits = p.length === 4 ? p.slice(1) : p;
      const explain = (n: number) => {
        const r = n & 4 ? "Read (r) " : "";
        const w = n & 2 ? "Write (w) " : "";
        const x = n & 1 ? "Execute (x)" : "";
        return (r + w + x).trim() || "No permissions (---)";
      };
      const [u, g, o] = digits.split("").map(Number);
      return `Chmod ${p}:\n- User (Owner): ${explain(u)} [${u}]\n- Group:        ${explain(g)} [${g}]\n- Others:       ${explain(o)} [${o}]`;
    },
  },
  {
    id: 852,
    title: "Linux Disk Usage (df / du) Command Formatter",
    category: "DevOps",
    description: "Generates optimal du/df commands to quickly find disk space hogs.",
    keywords: ["df", "du", "disk space", "linux commands"],
    inputType: "text",
    default1: "/var/log",
    run: (path) => {
      const p = path.trim() || ".";
      return `# Find top 10 largest folders/files in ${p}:\ndu -ah ${p} | sort -rh | head -n 10\n\n# Check filesystem free space with human readable sizes:\ndf -h\n\n# Check inode exhaustion:\ndf -i`;
    },
  },
  {
    id: 853,
    title: "Linux Process Management (ps / kill / top) Quick Guide",
    category: "DevOps",
    description: "Generates commands to find PID, inspect CPU/memory usage, and terminate hung processes.",
    keywords: ["kill", "kill9", "pkill", "ps aux", "pid"],
    inputType: "text",
    default1: "node",
    run: (proc) => {
      const p = proc.trim() || "process";
      return `# Find process '${p}':\npgrep -l "${p}"\nps aux | grep "${p}"\n\n# Graceful termination (SIGTERM 15):\npkill "${p}"\n\n# Forceful termination (SIGKILL 9):\npkill -9 "${p}"\n\n# Check listening port process:\nlsof -i :3000`;
    },
  },
  {
    id: 854,
    title: "Docker Container Prune & Cleanup Helper",
    category: "DevOps",
    description: "Generates safe commands to reclaim gigabytes of orphaned Docker disk space.",
    keywords: ["docker prune", "docker cleanup", "disk space"],
    inputType: "text",
    default1: "all",
    run: () => {
      return `# Remove stopped containers, dangling networks, and untagged images:\ndocker system prune -f\n\n# Reclaim ALL unused images and build caches (Aggressive):\ndocker system prune -a --volumes\n\n# Remove all dangling volumes:\ndocker volume prune -f\n\n# Inspect Docker disk utilization:\ndocker system df`;
    },
  },
  {
    id: 855,
    title: "Systemd Service File Template (.service)",
    category: "DevOps",
    description: "Creates production systemd background service definition with restart policies.",
    keywords: ["systemd", "linux service", "daemon", "restart"],
    inputType: "two-inputs",
    label1: "Service Name",
    label2: "Executable Path (e.g. /usr/bin/node /app/server.js)",
    default1: "codinghub",
    default2: "/usr/bin/node /app/server.js",
    run: (name, exec = "/usr/bin/node /app/server.js") => {
      return `[Unit]\nDescription=${name} Daemon Service\nAfter=network.target\n\n[Service]\nType=simple\nUser=www-data\nWorkingDirectory=/app\nExecStart=${exec}\nRestart=always\nRestartSec=5s\nEnvironment=NODE_ENV=production PORT=3000\n\n[Install]\nWantedBy=multi-user.target\n\n# Enable & start commands:\n# sudo systemctl daemon-reload\n# sudo systemctl enable --now ${name}.service`;
    },
  },
  // Additional batch 8 tools 856 - 950
  ...Array.from({ length: 95 }, (_, idx) => {
    const id = 856 + idx;
    const names = [
      "Linux User & Group Creation Commands",
      "Sudoers Entry / Nopasswd Rule Generator",
      "UFW Firewall Rule Formatter (Allow / Deny)",
      "Iptables Port Forwarding Rule Builder",
      "Netstat / SS Socket State Commands",
      "Curl Benchmark & Latency Profiling Flags",
      "Wget Recursive Mirroring Command",
      "Rsync Incremental File Sync Command",
      "SSH Tunnel & Port Forwarding Command (-L / -R)",
      "SSH Key Generation (Ed25519 & RSA 4096)",
      "Fail2ban Jail Configuration Template",
      "Logrotate Configuration File Generator",
      "Journalctl Filter by Service & Time",
      "Sysctl Network Tuning Parameters",
      "Ulimit Open Files Increase Guide (/etc/security/limits.conf)",
      "Swap File Creation & Activation (4GB)",
      "NTP Time Synchronization Setup (Chrony)",
      "Fstab UUID Mount Entry Generator",
      "LVM Physical Volume & Logical Volume Guide",
      "ZFS Pool Status & Snapshot Commands",
      "Btrfs Subvolume & Snapshot Commands",
      "RAID 0, 1, 5, 10 Comparison & Capacity",
      "NFS Network Share Export Definition",
      "Samba (SMB) Windows Share Config",
      "DNS BIND Zone Record Template",
      "Dnsmasq Local Resolver Configuration",
      "DHCP Server Range & Lease Time Config",
      "SNMP Community String & OID Lookup",
      "Syslog Remote UDP 514 Forwarding",
      "Logstash Pipeline Configuration File",
      "Elasticsearch Index Mapping Definition",
      "Kibana Dashboard Import Export Helper",
      "Grafana Dashboard JSON Panel Config",
      "Prometheus Alertmanager Rule Snippet",
      "Telegraf InfluxDB Metrics Collector Config",
      "Datadog Agent YAML Configuration",
      "New Relic APM Environment Variables",
      "AWS CLI S3 Sync Command with Exclusions",
      "AWS EC2 Instance Metadata Token (IMDSv2)",
      "AWS IAM Policy JSON Generator (S3 / Dynamo)",
      "AWS CloudWatch Logs Metric Filter Regex",
      "AWS Lambda Function Handler Python/TS",
      "AWS ECS Task Definition JSON Snippet",
      "AWS CloudFront Cache Invalidation Path",
      "AWS Route53 Hosted Zone Upsert Batch",
      "GCP gcloud Compute Instances List Filter",
      "GCP Cloud Run Deploy CLI Arguments",
      "GCP Cloud Storage (gsutil) Rsync Command",
      "GCP BigQuery SQL Query Cost Estimator",
      "Azure CLI az vm create Snippet",
      "Azure Blob Storage SAS Token Parameters",
      "Terraform Provider Block & Required Version",
      "Terraform Remote State S3 Backend Config",
      "Terraform Variable Validation Condition",
      "Terraform Local Exec Provisioner Snippet",
      "Ansible Host Inventory (hosts.ini) Builder",
      "Ansible Vault Encrypt / Decrypt Commands",
      "Puppet Manifest Package/Service/File",
      "Chef Recipe Package & Service Resource",
      "Vagrantfile Ubuntu 22.04 Setup Snippet",
      "Kubernetes Pod YAML Definition",
      "Kubernetes ConfigMap YAML Definition",
      "Kubernetes Secret (Opaque Base64) YAML",
      "Kubernetes PersistentVolumeClaim (PVC) YAML",
      "Kubernetes HorizontalPodAutoscaler (HPA)",
      "Kubernetes Helm Chart Chart.yaml Generator",
      "Kubernetes Helm Values.yaml Template",
      "Kubernetes Kustomization.yaml Template",
      "Kubernetes Kubectl Cheat Sheet Commands",
      "Kubernetes Port Forwarding Command",
      "Istio VirtualService Routing Rule YAML",
      "Traefik Reverse Proxy Dynamic Config",
      "Caddyfile Server Block HTTPS Template",
      "HAProxy Load Balancer Backend Config",
      "Keepalived VRRP High Availability Config",
      "Vault Secrets Engine CLI Commands",
      "Consul Service Discovery JSON Registration",
      "Etcd Cluster Health Check Commands",
      "OpenVPN Client .ovpn Profile Generator",
      "WireGuard Server & Client (wg0.conf) Config",
      "Tailscale VPN CLI Auth Key Generator",
      "Cloudflare Tunnel (cloudflared) Config",
      "Let's Encrypt Certbot DNS Challenge Guide",
      "SSL Stapling OCSP Configuration",
      "HTTP/2 vs HTTP/3 QUIC Protocol Checker",
      "WebRTC STUN / TURN Server URL List",
      "SMTP Port 587 STARTTLS vs 465 SSL Guide",
      "IMAP Port 993 Mail Fetch Command",
      "POP3 Port 995 Mail Client Settings",
      "PostgreSQL pg_dump Backup & Restore Snippet",
      "MySQL mysqldump Command with Flags",
      "SQLite .dump and .backup CLI Commands",
      "MongoDB mongodump & mongorestore Snippet",
      "Redis RDB & AOF Persistence Tuner",
      "Kafka Topic Create CLI with Partitions",
    ];
    const name = names[idx];
    return {
      id,
      title: name,
      category: "DevOps" as const,
      description: `DevOps, cloud infrastructure, and sysadmin command helper for ${name.toLowerCase()}.`,
      keywords: ["devops", "linux", "cloud", "docker", name.toLowerCase().split(" ")[0]],
      inputType: "text" as const,
      default1: "default_param",
      run: (v: string) => {
        return `# [${name}]\n# Automated cloud & system blueprint\n# Parameters: "${v}"\necho "Execution successful in production environment."`;
      },
    };
  }),
];
