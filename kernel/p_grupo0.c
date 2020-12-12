#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/mm.h>
#include <linux/proc_fs.h>
#include <linux/seq_file.h>
#include <linux/sched/signal.h>
#include <linux/sched/task.h>

#define procfs_name "process_g0"
struct proc_dir_entry *archivo_process_g0;


MODULE_LICENSE("GPL");

int proc_file_read(struct seq_file *buff, void *v) {
    
    struct task_struct *task;

    for_each_process(task) {
        seq_printf(buff, "%s %d %ld %d\n", task->comm , task->pid, task->state, task->recent_used_cpu);
    }

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
    printk(KERN_INFO "Buenas, att: 0, monitor de processos.\n");

    // create entry in /proc
    archivo_process_g0 = proc_create(procfs_name, 0, NULL, &file_ops);

    return 0;
}

void cleanup_module(void) {
    proc_remove(archivo_process_g0);
    printk(KERN_INFO "Bai, att: 0 y este fue el monitor de processos.\n");
}