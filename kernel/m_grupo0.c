#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/mm.h>
#include <linux/proc_fs.h>
#include <linux/seq_file.h>

#define procfs_name "monitor_g0"
struct proc_dir_entry *archivo_monitor_g0;


MODULE_LICENSE("GPL");

int proc_file_read(struct seq_file *buff, void *v) {
    // declarations
    static struct sysinfo info;
    unsigned long ram_total;
    unsigned long ram_libre;
    unsigned long ram_consumida;

    // obtain system memory information
    si_meminfo(&info);

    ram_total = info.totalram << (PAGE_SHIFT - 10);
    ram_libre = info.freeram << (PAGE_SHIFT - 10);
    ram_consumida = ram_total - ram_libre;

    printk(KERN_INFO "procfile_read (/proc/%s) called\n", procfs_name);

    seq_printf(buff, "%ld,%ld,%ld\n", ram_total, ram_libre, ram_consumida);

    return 0;
}

static int proc_init (struct inode *inode, struct file *file){
    return single_open(file, proc_file_read, NULL);
}

static const struct file_operations file_ops ={
    .owner = THIS_MODULE,
    .read = seq_read,
    .release = single_release,
    .open = proc_init,
    .llseek = seq_lseek
};

int init_module(void) {
    printk(KERN_INFO "Buenas, att: 0, monitor de memoria.\n");

    // create entry in /proc
    archivo_monitor_g0 = proc_create(procfs_name, 0, NULL, &file_ops);

    return 0;
}

void cleanup_module(void) {
    proc_remove(archivo_monitor_g0);
    printk(KERN_INFO "Bai, att: 0 y este fue el monitor de memoria.\n");
}